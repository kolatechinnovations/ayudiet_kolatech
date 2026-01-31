import { questions } from '../data/prakritiData';
import { vikritiQuestions } from '../data/vikritiData';

/**
 * Extract baseline agni from Prakriti answers
 * Uses questions: 1203 (Appetite Frequency), 1204 (Appetite Quantity), 1205 (Digestive Strength)
 */
export const extractAgniFromAnswers = (answers) => {
    const q1203 = questions.findIndex(q => q.id === 1203); // Appetite Frequency
    const q1205 = questions.findIndex(q => q.id === 1205); // Digestive Strength

    const appetiteFreq = answers[q1203]?.text || '';
    const digestiveStrength = answers[q1205]?.text || '';

    // Logic:
    // Irregular frequency → Vishamagni
    // Low digestive strength → Mandagni
    // High digestive strength → Tikshnagni
    // Regular + Medium/High → Samagni

    if (appetiteFreq === 'Irregular' || digestiveStrength === 'Variable') {
        return 'Vishamagni';
    }

    if (digestiveStrength === 'Low') {
        return 'Mandagni';
    }

    if (digestiveStrength === 'High') {
        return 'Tikshnagni';
    }

    // Regular + Medium → Samagni
    if (appetiteFreq === 'Regular' && (digestiveStrength === 'Medium' || digestiveStrength === 'High')) {
        return 'Samagni';
    }

    // Default fallback
    return 'Vishamagni';
};

/**
 * Extract Bala (strength) grades from Prakriti answers
 * Questions: 1501 (Physical), 1502 (Mental), 1503 (Disease Resistance/Immunity)
 */
export const extractBalaFromAnswers = (answers) => {
    const q1501 = questions.findIndex(q => q.id === 1501); // Physical Strength
    const q1502 = questions.findIndex(q => q.id === 1502); // Mental Strength
    const q1503 = questions.findIndex(q => q.id === 1503); // Disease Resistance

    const extractGrade = (answerText) => {
        if (!answerText) return 'Grade2';
        if (answerText.includes('Grade 1') || answerText.includes('Low')) return 'Grade1';
        if (answerText.includes('Grade 3') || answerText.includes('High')) return 'Grade3';
        return 'Grade2';
    };

    return {
        physical: extractGrade(answers[q1501]?.text),
        mental: extractGrade(answers[q1502]?.text),
        immunity: extractGrade(answers[q1503]?.text)
    };
};

/**
 * Extract tolerance levels from Prakriti answers
 * Question: 1602 (Weather Sensitivity)
 */
export const extractToleranceFromAnswers = (answers) => {
    const q1602 = questions.findIndex(q => q.id === 1602); // Weather Sensitivity
    const sensitivity = answers[q1602]?.text || '';

    // Map weather sensitivity to tolerance levels
    // "Cold" → Low cold tolerance, High heat tolerance
    // "Warm" → High cold tolerance, Low heat tolerance
    // "Both" → Medium both
    // "None" → High both

    if (sensitivity === 'Cold') {
        return { cold: 'Low', heat: 'High' };
    }

    if (sensitivity === 'Warm') {
        return { cold: 'High', heat: 'Low' };
    }

    if (sensitivity === 'Both') {
        return { cold: 'Medium', heat: 'Medium' };
    }

    if (sensitivity === 'None') {
        return { cold: 'High', heat: 'High' };
    }

    return { cold: 'Medium', heat: 'Medium' };
};

/**
 * Extract agni patterns from Vikriti Section C (ranking)
 */
export const extractAgniFromVikriti = (answers) => {
    const sectionC = answers.C || {};

    // Find dominant (value = 3) and secondary (value = 1)
    let primary = null;
    let secondary = null;

    const agniMap = {
        c1: 'Mandagni',
        c2: 'Vishamagni',
        c3: 'Tikshnagni',
        c4: 'Vishamagni', // Cold intolerance + gas
        c5: 'Tikshnagni', // Burning after meals
        c6: 'Mandagni'  // Heavy feeling post-meal
    };

    Object.keys(sectionC).forEach(qId => {
        const value = sectionC[qId];
        if (value === 3) {
            primary = agniMap[qId] || null;
        }
        if (value === 1) {
            secondary = agniMap[qId] || null;
        }
    });

    return {
        primary: primary || 'Vishamagni',
        secondary: secondary || null
    };
};

/**
 * Extract symptoms from Vikriti Section A
 */
export const extractSymptomsFromVikriti = (answers) => {
    const sectionA = answers.A || {};
    const symptoms = [];

    Object.keys(sectionA).forEach(qId => {
        const value = sectionA[qId];
        if (value >= 1) {
            const question = vikritiQuestions.A.find(q => q.id === qId);
            if (question) {
                symptoms.push(question.label);
            }
        }
    });

    return symptoms;
};

/**
 * Extract hetu (causative factors) from Vikriti Section B
 */
export const extractHetuFromVikriti = (answers) => {
    const sectionB = answers.B || {};
    const hetu = [];

    const hetuMap = {
        b1: 'Cold_Dry_Food',
        b2: 'Spicy_Hot_Food',
        b3: 'Heavy_Oily_Food',
        b4: 'Irregular_Meals',
        b5: 'Overeating',
        b6: 'Skipping_Meals'
    };

    Object.keys(sectionB).forEach(qId => {
        const value = sectionB[qId];
        if (value >= 1) {
            hetu.push(hetuMap[qId] || qId);
        }
    });

    return hetu;
};

/**
 * Extract season from Vikriti Section E
 */
export const extractSeasonFromVikriti = (answers) => {
    const sectionE = answers.E || {};

    const seasonMap = {
        e1: 'Cold_Dry',
        e2: 'Hot_Intense',
        e3: 'Cold_Damp'
    };

    for (const qId of Object.keys(sectionE)) {
        if (sectionE[qId] === 1) {
            return seasonMap[qId] || 'Mixed';
        }
    }

    return 'Mixed';
};

/**
 * Extract lifestyle flags from Vikriti Section F
 */
export const extractLifestyleFlagsFromVikriti = (answers) => {
    const sectionF = answers.F || {};
    const flags = [];

    const flagMap = {
        f1: 'Irregular_Routine',
        f2: 'Stress',
        f3: 'Excess_Heat',
        f4: 'Sedentary',
        f5: 'Excess_Sleep'
    };

    Object.keys(sectionF).forEach(qId => {
        const value = sectionF[qId];
        if (value === 1) {
            flags.push(flagMap[qId] || qId);
        }
    });

    return flags;
};
