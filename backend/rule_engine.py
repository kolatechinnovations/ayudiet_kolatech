import json
import os

# Path to the rule database
RULE_DB_PATH = os.path.join(os.path.dirname(__file__), "gr_clean.json")

def load_rules():
    print(f"Loading rules from: {RULE_DB_PATH}")
    if not os.path.exists(RULE_DB_PATH):
        print(f"ERROR: Rule database NOT found at {RULE_DB_PATH}")
        # Try fallback to original location just in case
        fallback = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "gr_clean.json")
        if os.path.exists(fallback):
            print(f"Found fallback at {fallback}")
            with open(fallback, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
        
    with open(RULE_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_dosha_dominance(vikriti):
    # vikriti: { vata_score, pitta_score, kapha_score } or { vata_percentage, ... }
    def get_score(key):
        return vikriti.get(key) or vikriti.get(f"{key}_percentage") or vikriti.get(f"{key}_score") or 0

    scores = [
        ("vata", get_score("vata")),
        ("pitta", get_score("pitta")),
        ("kapha", get_score("kapha"))
    ]
    scores.sort(key=lambda x: x[1], reverse=True)
    primary = scores[0][0]
    secondary = scores[1][0]
    return primary, secondary

def standardize(s):
    if not isinstance(s, str): return s
    # Standardize common variations
    s = s.replace("_", " ").lower()
    if "food" in s and "foods" not in s:
        s = s.replace("food", "foods")
    return s.strip()

def get_dosha_relevance(rule, primary_dosha):
    # Determine if a rule pacifies or aggravates based on keywords
    rule_id = rule.get("rule_id", "").upper()
    if primary_dosha.upper() in rule_id:
        return 0.2  # Pacifies (assuming rules in DB are corrective)
    return 0.0

def matches_trigger(trigger_obj, patient_data):
    # trigger_obj: { symptoms: [...], agni: [...], hetu: [...], ... }
    # patient_data: { symptoms: [...], agni: {primary, secondary}, hetu: [...], season: "", lifestyle_flags: [...] }
    
    match_count = 0
    total_triggers = 0
    
    # Pre-standardize patient data lists
    patient_symptoms = [standardize(s) for s in patient_data.get("symptoms", [])]
    patient_hetu = [standardize(h) for h in patient_data.get("hetu", [])]
    patient_lifestyle = [standardize(l) for l in patient_data.get("lifestyle_flags", [])]
    patient_season = standardize(patient_data.get("season", ""))
    
    # Handle Agni (can be nested or flat)
    patient_agni_obj = patient_data.get("agni", {})
    if isinstance(patient_agni_obj, dict):
        p_agni_primary = patient_agni_obj.get("primary")
        p_agni_secondary = patient_agni_obj.get("secondary")
    else:
        p_agni_primary = None
        p_agni_secondary = None
    
    # Also check top-level agni_primary/secondary
    p_agni_primary = p_agni_primary or patient_data.get("agni_primary")
    p_agni_secondary = p_agni_secondary or patient_data.get("agni_secondary")
    
    p_agni_list = [standardize(a) for a in [p_agni_primary, p_agni_secondary] if a]

    for key, values in trigger_obj.items():
        if not values: continue
        total_triggers += 1
        
        # Standardize trigger values from DB
        std_values = [standardize(v) for v in values]
        
        if key == "symptoms":
            if any(s in patient_symptoms for s in std_values):
                match_count += 1
        elif key == "agni":
            if any(a in p_agni_list for a in std_values):
                match_count += 1
        elif key == "hetu":
            if any(h in patient_hetu for h in std_values):
                match_count += 1
        elif key == "season":
            if patient_season in std_values:
                match_count += 1
        elif key == "lifestyle":
            if any(l in patient_lifestyle for l in std_values):
                match_count += 1
        elif key == "physical_signs":
             # physical_signs often maps to symptoms in the simplified data
             if any(s in patient_symptoms for s in std_values):
                 match_count += 1

    if total_triggers == 0:
        return 0.0
    
    return match_count / total_triggers

def get_recommendations(patient_data):
    print(f"Generating recommendations for data: {json.dumps(patient_data)}")
    rules = load_rules()
    vikriti = patient_data.get("vikriti", {})
    primary_dosha, secondary_dosha = get_dosha_dominance(vikriti)
    
    selected_rules = []
    
    for rule in rules:
        trigger_obj = rule.get("trigger", {})
        if not trigger_obj: continue
        
        match_strength = matches_trigger(trigger_obj, patient_data)
        if match_strength == 0:
            continue
            
        dosha_rel = get_dosha_relevance(rule, primary_dosha)
        
        base_weight = rule.get("weight", 1.0)
        final_weight = base_weight * match_strength * (1.0 + dosha_rel)
        
        # Round for readability
        final_weight = round(final_weight, 2)
        
        # Categorize
        category = "Unknown"
        keys = list(trigger_obj.keys())
        if len(keys) > 1:
            category = " + ".join([k.capitalize() for k in keys])
        elif keys:
            category = keys[0].capitalize()
            
        # Determine Explaination
        explanation = f"Selected because patient has matching {category.lower()} patterns."
        # Enrich explanation based on triggers
        trigger_matches = []
        for key, values in trigger_obj.items():
            if key == "symptoms":
                matches = [v for v in values if v in patient_data.get("symptoms", [])]
                if matches: trigger_matches.append(f"symptoms: {', '.join(matches)}")
            # ... add more for agni, season etc.
            
        rule_info = {
            "rule_id": rule["rule_id"],
            "category": category,
            "why": explanation,
            "trigger_factor": ", ".join(trigger_matches) if trigger_matches else category,
            "final_weight": final_weight,
            "type": "Primary" if final_weight > 1.2 else "Supporting",
            "details": rule.get("prefer", {})
        }
        selected_rules.append(rule_info)

    # Sort by weight
    selected_rules.sort(key=lambda x: x["final_weight"], reverse=True)
    
    # Conflict Resolution (Basic: if same rule_id prefix or similar trigger, keep highest)
    # Actually, instructions say: 1. Combined, 2. Symptom, 3. Agni, 4. Season/Lifestyle
    # We'll use a priority field for sorting before slicing.
    
    def get_priority(rule_info):
        cat = rule_info["category"].lower()
        if "+" in cat: return 0 # Combined (Highest priority)
        if "symptom" in cat: return 1
        if "agni" in cat: return 2
        return 3 # Season/Lifestyle
        
    selected_rules.sort(key=lambda x: (get_priority(x), -x["final_weight"]))
    
    # Limit to 8-12
    return selected_rules[:12]
