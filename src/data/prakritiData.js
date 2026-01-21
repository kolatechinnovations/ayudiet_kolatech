
export const sections = [
  { id: 'A', title: 'Body Frame & Constitution' },
  { id: 'B', title: 'Head, Face & Features' },
  { id: 'C', title: 'Skin' },
  { id: 'D', title: 'Hair' },
  { id: 'E', title: 'Nails' },
  { id: 'F', title: 'Teeth & Palate' },
  { id: 'G', title: 'Lips, Palms & Soles' },
  { id: 'H', title: 'Food & Digestion' },
  { id: 'I', title: 'Physiological Functions' },
  { id: 'J', title: 'Health & Environmental' },
  { id: 'K', title: 'Speech, Movement & Mind' },
  { id: 'L', title: 'Work & Social' }
];

export const questions = [
  // --- Q1: Body Frame – Width ---
  {
    id: 101, section: 'A', question: 'Overall Body Frame Width',
    options: [
      { text: 'Thin / Narrow', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Broad', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 102, section: 'A', question: 'Shoulder Width',
    options: [
      { text: 'Thin / Narrow', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Broad', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 103, section: 'A', question: 'Chest Width',
    options: [
      { text: 'Thin / Narrow', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Broad', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 104, section: 'A', question: 'Forehead Width',
    options: [
      { text: 'Thin / Narrow', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Broad', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q2: Body Frame – Length ---
  {
    id: 201, section: 'A', question: 'Overall Body Height',
    options: [
      { text: 'Tall / Long', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Short', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 202, section: 'A', question: 'Forehead Length',
    options: [
      { text: 'Long', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Short', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q3: Size & Development ---
  {
    id: 301, section: 'A', question: 'Body Build',
    options: [
      { text: 'Weakly Developed', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderately Developed', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Well Developed', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 302, section: 'B', question: 'Face Size / Development',
    options: [
      { text: 'Small / Weakly Developed', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium / Moderately Developed', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Large / Well Developed', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 303, section: 'B', question: 'Eyes Size',
    options: [
      { text: 'Small', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Large', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 304, section: 'B', question: 'Eyelashes',
    options: [
      { text: 'Thin / Sparse', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Long / Thick / Dense', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 305, section: 'A', question: 'Joints Size',
    options: [
      { text: 'Thin / Narrow', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Large / Broad', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 306, section: 'G', question: 'Lips Size',
    options: [
      { text: 'Small', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Large', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 307, section: 'E', question: 'Nails Size',
    options: [
      { text: 'Small', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Long', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q4: Musculature ---
  {
    id: 401, section: 'A', question: 'Body Musculature',
    options: [
      { text: 'Thin', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Soft & Loosely Knitted', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Smooth & Firmly Knitted', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q5: Skin Features ---
  {
    id: 501, section: 'C', question: 'Skin Appearance (Select all that apply)',
    allowMultiple: true,
    options: [
      { text: 'Cracked', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Wrinkled', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Prominent Veins', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Pimples', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Freckles', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Marks', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Moles', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Lustrous', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Clear', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 502, section: 'C', question: 'Skin Nature',
    options: [
      { text: 'Dry', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Oily', score: { vata: 0, pitta: 1, kapha: 2 } },
      { text: 'Normal', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Seasonal / Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 503, section: 'C', question: 'Skin Texture',
    options: [
      { text: 'Rough', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Smooth', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Coarse', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 504, section: 'C', question: 'Skin Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Fair Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Fair Pink', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Wheatish', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Dusky', score: { vata: 1, pitta: 0, kapha: 1 } }
    ]
  },
  {
    id: 505, section: 'C', question: 'Skin Thickness',
    options: [
      { text: 'Thin', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Thick', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q6: Hair Features ---
  {
    id: 601, section: 'D', question: 'Hair Nature',
    options: [
      { text: 'Dry', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Oily', score: { vata: 0, pitta: 1, kapha: 2 } },
      { text: 'Normal', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Seasonal / Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 602, section: 'D', question: 'Hair Color',
    options: [
      { text: 'Black', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Dark Brown', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Light Brown', score: { vata: 1, pitta: 1, kapha: 0 } },
      { text: 'Blonde', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Copper', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Dusky', score: { vata: 1, pitta: 0, kapha: 1 } }
    ]
  },
  {
    id: 603, section: 'D', question: 'Hair Type (Thickness)',
    options: [
      { text: 'Thick', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Thin', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 604, section: 'D', question: 'Hair Prone To (Select all)',
    allowMultiple: true,
    options: [
      { text: 'Graying', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Falling', score: { vata: 1, pitta: 1, kapha: 0 } },
      { text: 'Breaking / Split Ends', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'None', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q7: Nail Features ---
  {
    id: 701, section: 'E', question: 'Nail Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pink', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 702, section: 'E', question: 'Nail Texture',
    options: [
      { text: 'Rough', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Soft', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Smooth', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 703, section: 'E', question: 'Nail Nature',
    options: [
      { text: 'Firm', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Brittle', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q8: Teeth & Palate ---
  {
    id: 801, section: 'F', question: 'Teeth Color',
    options: [
      { text: 'Dull / Blackish', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Milky White', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Yellowish', score: { vata: 0, pitta: 2, kapha: 0 } }
    ]
  },
  {
    id: 802, section: 'F', question: 'Teeth Shape',
    options: [
      { text: 'Even', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Uneven', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 803, section: 'F', question: 'Teeth Size',
    options: [
      { text: 'Large', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Small', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 804, section: 'F', question: 'Palate Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pink', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },

  // --- Q9: Lips Features (Color/Nature) ---
  {
    id: 901, section: 'G', question: 'Lips Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pink', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 902, section: 'G', question: 'Lips Nature',
    options: [
      { text: 'Firm', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Cracked', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Wrinkled', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q10: Palm Features ---
  {
    id: 1001, section: 'G', question: 'Palm Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pink', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 1002, section: 'G', question: 'Palm Nature',
    options: [
      { text: 'Firm', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Cracked', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Wrinkled', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q11: Sole Features ---
  {
    id: 1101, section: 'G', question: 'Sole Color',
    options: [
      { text: 'Dark', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Reddish', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pale Yellow', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pink', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 1102, section: 'G', question: 'Sole Nature',
    options: [
      { text: 'Firm', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Cracked', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Wrinkled', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q12: Food & Digestion ---
  {
    id: 1201, section: 'H', question: 'Taste Preference',
    options: [
      { text: 'Sweet', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Sour', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Salty', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Bitter', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Pungent', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Astringent', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1202, section: 'H', question: 'Food / Beverage Preference (Temp)',
    options: [
      { text: 'Cold', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Warm', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Any', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 1203, section: 'H', question: 'Appetite Frequency',
    options: [
      { text: 'Regular', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Irregular', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1204, section: 'H', question: 'Appetite Quantity',
    options: [
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 1205, section: 'H', question: 'Digestive Strength',
    options: [
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },

  // --- Q13: Physiological Functions ---
  {
    id: 1301, section: 'I', question: 'Body Temperature',
    options: [
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 1302, section: 'I', question: 'Perspiration (Sweating)',
    options: [
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 1303, section: 'I', question: 'Body Odor',
    options: [
      { text: 'Very Less', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Mild', score: { vata: 0, pitta: 0, kapha: 0 } }, // Not specified in prompt, assume 0 or 1. User: "Mild -> ??". Table says "Very mild -> V2", "Strong -> P2 K1". I'll default to 0.
      { text: 'Strong', score: { vata: 0, pitta: 2, kapha: 1 } }
    ]
  },
  {
    id: 1304, section: 'I', question: 'Sleep Duration',
    options: [
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Variable', score: { vata: 1, pitta: 1, kapha: 0 } }
    ]
  },
  {
    id: 1305, section: 'I', question: 'Sleep Quality',
    options: [
      { text: 'Deep', score: { vata: 0, pitta: 0, kapha: 2 } }, // Inferred Kapha for Deep
      { text: 'Sound', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Shallow', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1306, section: 'I', question: 'Body Weight Change',
    options: [
      { text: 'Gain & Lose Easily', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Difficulty Gaining', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Gain Easily, Lose with Difficulty', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Stable', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },

  // --- Q14: Bowel Pattern ---
  {
    id: 1401, section: 'I', question: 'Bowel Frequency',
    options: [
      { text: 'Regular', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Irregular', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1402, section: 'I', question: 'Bowel Tendency',
    options: [
      { text: 'Constipation', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Loose Motion', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Normal', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 1403, section: 'I', question: 'Stool Consistency',
    options: [
      { text: 'Hard', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Soft / Semi-solid', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Well Formed', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },

  // --- Q15: Strength Assessment ---
  {
    id: 1501, section: 'I', question: 'Physical Strength',
    options: [
      { text: 'Grade 1 (Low)', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Grade 2 (Med)', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Grade 3 (High)', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1502, section: 'I', question: 'Mental Strength',
    options: [
      { text: 'Grade 1', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Grade 2', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Grade 3', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1503, section: 'I', question: 'Disease Resistance',
    options: [
      { text: 'Grade 1', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Grade 2', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Grade 3', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1504, section: 'I', question: 'Healing Capacity',
    options: [
      { text: 'Grade 1', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Grade 2', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Grade 3', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q16: Environmental Tolerance ---
  {
    id: 1601, section: 'J', question: 'Seasonal Health Issues',
    options: [
      { text: 'Summer', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Early Winter', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Late Winter', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Rainy', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Autumn', score: { vata: 0, pitta: 1, kapha: 1 } }, // Typical Vata aggravates in Autumn? User manual: "Winter/Rainy -> V2". I'll map as per user block: "Winter/Rainy 2, Summer P2, Spring K2"
      { text: 'Spring', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Seasonal Transition', score: { vata: 1, pitta: 1, kapha: 1 } },
      { text: 'None', score: { vata: 0, pitta: 1, kapha: 1 } }
    ]
  },
  {
    id: 1602, section: 'J', question: 'Weather Sensitivity',
    options: [
      { text: 'Cold', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Warm', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Both', score: { vata: 1, pitta: 1, kapha: 0 } },
      { text: 'None', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q17: Speech & Voice ---
  {
    id: 1701, section: 'K', question: 'Speaking Speed',
    options: [
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1702, section: 'K', question: 'Speaking Quantity',
    options: [
      { text: 'Excessive', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1703, section: 'K', question: 'Speech Nature (Select applicable)',
    allowMultiple: true,
    options: [
      { text: 'Convincing', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Argumentative', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Sweet & Pleasing', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Avoids Confrontation', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Deviates from Topic', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Irrelevant in Between', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1704, section: 'K', question: 'Voice Clarity',
    options: [
      { text: 'Clear', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Unclear', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1705, section: 'K', question: 'Voice Quality',
    options: [
      { text: 'Rough', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Deep', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Sharp', score: { vata: 0, pitta: 2, kapha: 0 } }
    ]
  },

  // --- Q18: Movements at Rest ---
  {
    id: 1801, section: 'K', question: 'Hand Movement',
    options: [
      { text: 'High', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1802, section: 'K', question: 'Leg Movement',
    options: [
      { text: 'High', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1803, section: 'K', question: 'Eyebrow Movement',
    options: [
      { text: 'High', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1804, section: 'K', question: 'Shoulder Movement',
    options: [
      { text: 'High', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },

  // --- Q19: Walking Pattern ---
  {
    id: 1901, section: 'K', question: 'Walking Amount',
    options: [
      { text: 'Excessive', score: { vata: 2, pitta: 0, kapha: 0 } }, // Inferred
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Less', score: { vata: 0, pitta: 0, kapha: 2 } }
    ]
  },
  {
    id: 1902, section: 'K', question: 'Walking Speed',
    options: [
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 1903, section: 'K', question: 'Walking Style',
    options: [
      { text: 'Firm / Steady', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Sharp / Accurate', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Wavering / Unsteady', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q20: Memory & Cognition ---
  {
    id: 2001, section: 'K', question: 'Memorizing Speed',
    options: [
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2002, section: 'K', question: 'Forgetfulness',
    options: [
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2003, section: 'K', question: 'Retention Power',
    options: [
      { text: 'Good', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Poor', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2004, section: 'K', question: 'Olfactory Memory (Smell)',
    options: [
      { text: 'Good', score: { vata: 0, pitta: 0, kapha: 2 } }, // Usually Kapha
      { text: 'Poor', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },

  // --- Q21: Execution of Work ---
  {
    id: 2101, section: 'L', question: 'Working Quality',
    options: [
      { text: 'Sharp / Spontaneous', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Well Thought Out', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Easily Deviated', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2102, section: 'L', question: 'Working Speed',
    options: [
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2103, section: 'L', question: 'Working Style',
    options: [
      { text: 'Firm / Steady', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Sharp / Accurate', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Unsteady', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2104, section: 'L', question: 'Planning Ability',
    options: [
      { text: 'Good', score: { vata: 0, pitta: 2, kapha: 2 } },
      { text: 'Medium', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Poor', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2105, section: 'L', question: 'Initiation Speed',
    options: [
      { text: 'Fast', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderate', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Slow', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variable', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2106, section: 'L', question: 'Execution Quality',
    options: [
      { text: 'Good', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Poor', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2107, section: 'L', question: 'Task Completion',
    options: [
      { text: 'High', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Medium', score: { vata: 0, pitta: 1, kapha: 1 } },
      { text: 'Low', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  // Q22: Social - Keeping as Q22
  {
    id: 2201, section: 'L', question: 'Making Friends',
    options: [
      { text: 'Quickly', score: { vata: 2, pitta: 0, kapha: 0 } },
      { text: 'Moderately', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Slowly', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variably', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  },
  {
    id: 2202, section: 'L', question: 'Irritation Frequency',
    options: [
      { text: 'Quickly', score: { vata: 0, pitta: 2, kapha: 0 } },
      { text: 'Moderately', score: { vata: 2, pitta: 0, kapha: 0 } }, // Vata is also quick/variable
      { text: 'Slowly', score: { vata: 0, pitta: 0, kapha: 2 } },
      { text: 'Variably', score: { vata: 2, pitta: 0, kapha: 0 } }
    ]
  }
];
