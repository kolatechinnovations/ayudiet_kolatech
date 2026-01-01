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
