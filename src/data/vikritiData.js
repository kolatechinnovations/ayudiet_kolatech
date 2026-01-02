export const vikritiSections = [
    { id: 'A', title: 'Digestive Symptoms', type: 'multi-intensity' },
    { id: 'B', title: 'Diet & Habit Causes (Hetu)', type: 'multi-intensity' },
    { id: 'C', title: 'Agni (Digestive Fire) Patterns', type: 'ranking' },
    { id: 'D', title: 'Physical & Emotional Signs', type: 'multi-intensity' },
    { id: 'E', title: 'Seasonal & Environmental Shifts', type: 'single' },
    { id: 'F', title: 'Lifestyle Shifts', type: 'multi' }
];

export const vikritiQuestions = {
    A: [
        { id: 'a1', label: 'Constipation', dosha: 'vata', reason: 'Dry, irregular bowel movement' },
        { id: 'a2', label: 'Gas, bloating', dosha: 'vata', reason: 'Air + movement quality of Vata' },
        { id: 'a3', label: 'Burning sensation / acidity', dosha: 'pitta', reason: 'Heat and sharpness' },
        { id: 'a4', label: 'Loose stools / diarrhea', dosha: 'pitta', reason: 'Excess digestive fire' },
        { id: 'a5', label: 'Heaviness after meals', dosha: 'kapha', reason: 'Heavy, slow digestion' },
        { id: 'a6', label: 'Sluggish digestion', dosha: 'kapha', reason: 'Weak agni due to Kapha' },
        { id: 'a7', label: 'Poor appetite', dosha: ['vata', 'kapha'], reason: 'Irregular (Vata) or dull (Kapha) agni' }
    ],
    B: [
        { id: 'b1', label: 'Cold, dry foods', dosha: 'vata', reason: 'Cold + dryness' },
        { id: 'b2', label: 'Spicy, hot foods', dosha: 'pitta', reason: 'Heat' },
        { id: 'b3', label: 'Heavy, oily foods', dosha: 'kapha', reason: 'Oil + heaviness' },
        { id: 'b4', label: 'Irregular meals', dosha: 'vata', reason: 'Disturbs rhythm' },
        { id: 'b5', label: 'Overeating', dosha: 'kapha', reason: 'Excess accumulation' },
        { id: 'b6', label: 'Skipping meals', dosha: ['vata', 'pitta'], reason: 'Irregularity + fire irritation' }
    ],
    C: [
        { id: 'c1', label: 'Mandagni (weak) - Dull appetite, heaviness, nausea', dosha: 'kapha', logic: 'Kapha suppresses agni' },
        { id: 'c2', label: 'Vishamagni (irregular) - Gas, bloating, variable appetite', dosha: 'vata', logic: 'Vata instability' },
        { id: 'c3', label: 'Tikshnagni (sharp) - Burning, acidity, excess hunger', dosha: 'pitta', logic: 'Excess heat' },
        { id: 'c4', label: 'Cold intolerance + gas - Abdominal distension, chill', dosha: 'vata', logic: 'Cold + dry' },
        { id: 'c5', label: 'Burning after meals - Acid reflux, inflammation', dosha: 'pitta', logic: 'Heat dominance' },
        { id: 'c6', label: 'Heavy feeling post-meal - Lethargy, mucus', dosha: 'kapha', logic: 'Slow metabolism' }
    ],
    D: [
        { id: 'd1', category: 'Vata', label: 'Dry skin, cracking joints, tremors', dosha: 'vata' },
        { id: 'd2', category: 'Vata', label: 'Constipation, gas', dosha: 'vata' },
        { id: 'd3', category: 'Vata', label: 'Anxiety, fear, restlessness', dosha: 'vata' },
        { id: 'd4', category: 'Vata', label: 'Light, broken sleep', dosha: 'vata' },
        { id: 'd5', category: 'Pitta', label: 'Heat intolerance, rashes', dosha: 'pitta' },
        { id: 'd6', category: 'Pitta', label: 'Acid reflux, loose stools', dosha: 'pitta' },
        { id: 'd7', category: 'Pitta', label: 'Anger, irritability', dosha: 'pitta' },
        { id: 'd8', category: 'Pitta', label: 'Excess sweating, thirst', dosha: 'pitta' },
        { id: 'd9', category: 'Kapha', label: 'Weight gain, edema', dosha: 'kapha' },
        { id: 'd10', category: 'Kapha', label: 'Sluggish digestion, mucus', dosha: 'kapha' },
        { id: 'd11', category: 'Kapha', label: 'Lethargy, attachment', dosha: 'kapha' },
        { id: 'd12', category: 'Kapha', label: 'Congestion, sinus', dosha: 'kapha' }
    ],
    E: [
        { id: 'e1', label: 'Cold & dry (fall/winter)', dosha: 'vata', reason: 'Dry + cold' },
        { id: 'e2', label: 'Hot & intense (summer)', dosha: 'pitta', reason: 'Heat' },
        { id: 'e3', label: 'Cold & damp (spring/rainy)', dosha: 'kapha', reason: 'Moist + heavy' }
    ],
    F: [
        { id: 'f1', label: 'Irregular routine', dosha: 'vata', reason: 'Rhythm disturbance' },
        { id: 'f2', label: 'Excess stress / travel', dosha: 'vata', reason: 'Over-movement' },
        { id: 'f3', label: 'Excess sun / heat', dosha: 'pitta', reason: 'Heat' },
        { id: 'f4', label: 'Sedentary lifestyle', dosha: 'kapha', reason: 'Inertia' },
        { id: 'f5', label: 'Excess daytime sleep', dosha: 'kapha', reason: 'Accumulation' }
    ]
};
