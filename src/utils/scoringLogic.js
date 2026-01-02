import { vikritiQuestions } from '../data/vikritiData';

export const calculatePrakriti = (answers) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    answers.forEach((answer) => {
        if (answer && answer.score) {
            Object.keys(answer.score).forEach((dosha) => {
                scores[dosha] += answer.score[dosha];
            });
        }
    });

    const total = scores.vata + scores.pitta + scores.kapha;

    const vataP = total > 0 ? (scores.vata / total) * 100 : 0;
    const pittaP = total > 0 ? (scores.pitta / total) * 100 : 0;
    const kaphaP = total > 0 ? (scores.kapha / total) * 100 : 0;

    const percentages = {
        vata: parseFloat(vataP.toFixed(1)),
        pitta: parseFloat(pittaP.toFixed(1)),
        kapha: parseFloat(kaphaP.toFixed(1))
    };

    const prakritiType = classifyPrakriti(percentages);

    return {
        prakriti_scores: scores,
        prakriti_percentage: percentages,
        prakriti_type: prakritiType
    };
};

const classifyPrakriti = (percentages) => {
    const sorted = Object.entries(percentages)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value }));

    const top = sorted[0];
    const second = sorted[1];
    const third = sorted[2];

    // Tridosha: All around ~33%
    // If the difference between highest and lowest is small (e.g. < 5-7%)
    if (top.value - third.value < 7) {
        return 'Tridosha';
    }

    // Single Dosha: One dosha >= 50%
    if (top.value >= 50) {
        return top.name.charAt(0).toUpperCase() + top.name.slice(1);
    }

    // Dual Dosha: Two doshas >= 30%
    // We name it based on the top two
    return `${top.name.charAt(0).toUpperCase() + top.name.slice(1)}-${second.name.charAt(0).toUpperCase() + second.name.slice(1)}`;
};

export const calculateVikriti = (answers) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    // answers format: { sectionId: { questionId: intensityValue } }
    // intensityValue: 2 for Strong/Regular, 1 for Occasional/Mild
    // Agni: 3 for Dominant, 1 for Secondary
    // Seasonal: 1 for Current
    // Lifestyle: 1 for Active factor

    Object.keys(answers).forEach(sectionId => {
        const sectionAnswers = answers[sectionId];
        Object.keys(sectionAnswers).forEach(questionId => {
            const value = sectionAnswers[questionId];
            if (value === 0) return;

            // Find question in vikritiQuestions
            const questionList = vikritiQuestions[sectionId];
            const question = questionList.find(q => q.id === questionId);

            if (question) {
                const doshas = Array.isArray(question.dosha) ? question.dosha : [question.dosha];
                doshas.forEach(dosha => {
                    scores[dosha] += value;
                });
            }
        });
    });

    const total = scores.vata + scores.pitta + scores.kapha;

    const percentages = {
        vata: total > 0 ? parseFloat(((scores.vata / total) * 100).toFixed(1)) : 0,
        pitta: total > 0 ? parseFloat(((scores.pitta / total) * 100).toFixed(1)) : 0,
        kapha: total > 0 ? parseFloat(((scores.kapha / total) * 100).toFixed(1)) : 0
    };

    const interpretation = interpretVikriti(percentages);

    return {
        vikriti_scores: scores,
        vikriti_percentage: percentages,
        vikriti_interpretation: interpretation
    };
};

const interpretVikriti = (percentages) => {
    const imbalances = [];

    if (percentages.vata >= 40) imbalances.push('Vata');
    if (percentages.pitta >= 40) imbalances.push('Pitta');
    if (percentages.kapha >= 40) imbalances.push('Kapha');

    if (imbalances.length === 0) {
        // Fallback or secondary imbalance
        const sorted = Object.entries(percentages)
            .sort(([, a], [, b]) => b - a);

        if (sorted[0][1] >= 25) {
            return `${sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1)} Imbalance`;
        }
        return 'Minor Imbalance';
    }

    return imbalances.join('-') + ' Vikriti';
};
