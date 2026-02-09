import json
import os

# Path to the rule database
RULE_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "gr_clean.json")

def load_rules():
    with open(RULE_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_dosha_dominance(vikriti):
    # vikriti: { vata_score, pitta_score, kapha_score }
    scores = [
        ("vata", vikriti.get("vata", 0)),
        ("pitta", vikriti.get("pitta", 0)),
        ("kapha", vikriti.get("kapha", 0))
    ]
    scores.sort(key=lambda x: x[1], reverse=True)
    primary = scores[0][0]
    secondary = scores[1][0]
    return primary, secondary

def get_dosha_relevance(rule, primary_dosha):
    # This is a simplified mapping. In a real scenario, we'd look at rule attributes
    # For now, we'll check rule_id or tags if available.
    # But based on instructions: "Pacifies dominant dosha -> +0.2", "Aggravates dominant dosha -> -0.3"
    # We need to determine if a rule pacifies or aggravates.
    
    # Heuristic: 
    # Vata rules often have "VR_VATA" or mention Vata triggers.
    # VR_CONSTIPATION_01 might be Vata-aggravating if ignored? 
    # Actually, the instructions say: 
    # "Prefer rules that pacify dominant dosha"
    # "Avoid rules that aggravate dominant dosha"
    
    # We can check the 'rule_id' for dosha names.
    rule_id = rule.get("rule_id", "").upper()
    
    if primary_dosha.upper() in rule_id:
        return 0.2  # Pacifies (assuming rules in DB are corrective)
    
    # If rule is for another dosha but triggers match, it might be neutral
    # or we could check attributes (guna/rasa) if we had a mapping.
    # For this implementation, we'll check the rule_id for primary/secondary keywords.
    return 0.0

def matches_trigger(trigger_obj, patient_data):
    # trigger_obj: { symptoms: [...], agni: [...], hetu: [...], ... }
    # patient_data: { symptoms: [...], agni: {primary, secondary}, hetu: [...], season: "", lifestyle_flags: [...] }
    
    match_count = 0
    total_triggers = 0
    
    for key, values in trigger_obj.items():
        if not values: continue
        total_triggers += 1
        
        if key == "symptoms":
            patient_symptoms = patient_data.get("symptoms", [])
            if any(s in patient_symptoms for s in values):
                match_count += 1
        elif key == "agni":
            patient_agni = patient_data.get("agni", {})
            primary_agni = patient_agni.get("primary")
            secondary_agni = patient_agni.get("secondary")
            if any(a in [primary_agni, secondary_agni] for a in values):
                match_count += 1
        elif key == "hetu":
            patient_hetu = patient_data.get("hetu", [])
            if any(h in patient_hetu for h in values):
                match_count += 1
        elif key == "season":
            patient_season = patient_data.get("season", "")
            if patient_season in values:
                match_count += 1
        elif key == "lifestyle":
            patient_lifestyle = patient_data.get("lifestyle_flags", [])
            if any(l in patient_lifestyle for l in values):
                match_count += 1
        elif key == "physical_signs":
             # physical_signs might be in symptoms or a separate field if we added it
             # For now, treat symptoms as a superset if physical_signs is used in rules
             patient_symptoms = patient_data.get("symptoms", [])
             if any(s in patient_symptoms for s in values):
                 match_count += 1

    if total_triggers == 0:
        return 0.0
    
    return match_count / total_triggers

def get_recommendations(patient_data):
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
            "type": "Primary" if final_weight > 1.2 else "Supporting"
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
