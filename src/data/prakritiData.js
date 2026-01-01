export const sections = [
  { id: 'A', title: 'Body Morphology & Structure' },
  { id: 'B', title: 'Head, Face & Features' },
  { id: 'C', title: 'Skin, Hair, Nails, Lips, Teeth' },
  { id: 'D', title: 'Appetite, Digestion, Food Habits' },
  { id: 'E', title: 'Sleep & Energy' },
  { id: 'F', title: 'Mental & Emotional Traits' },
  { id: 'G', title: 'Activity Patterns' },
  { id: 'H', title: 'Miscellaneous Lifestyle / Weather / Body' }
];

export const questions = [
  // SECTION A
  {
    id: 1, section: 'A', question: 'Body appearance',
    options: [
      { text: 'Slim', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 2 } },
      { text: 'Large', score: { kapha: 2 } }
    ]
  },
  {
    id: 2, section: 'A', question: 'Body weight',
    options: [
      { text: 'Low', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 2 } },
      { text: 'Overweight', score: { kapha: 2 } }
    ]
  },
  {
    id: 3, section: 'A', question: 'Body build (bulk)',
    options: [
      { text: 'Weakly developed', score: { vata: 2 } },
      { text: 'Moderately developed', score: { pitta: 2 } },
      { text: 'Well developed', score: { kapha: 2 } }
    ]
  },
  {
    id: 4, section: 'A', question: 'Body musculature',
    options: [
      { text: 'Thin', score: { vata: 2 } },
      { text: 'Soft/loose', score: { pitta: 1, kapha: 1 } },
      { text: 'Firm', score: { kapha: 2 } }
    ]
  },
  {
    id: 5, section: 'A', question: 'Chest',
    options: [
      { text: 'Flat/Sunken', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Expanded/Round', score: { kapha: 2 } }
    ]
  },
  {
    id: 6, section: 'A', question: 'Belly',
    options: [
      { text: 'Thin/Flat', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Big/Potbellied', score: { kapha: 2 } }
    ]
  },
  {
    id: 7, section: 'A', question: 'Bellybutton',
    options: [
      { text: 'Small/Irregular', score: { vata: 2 } },
      { text: 'Oval/Superficial', score: { pitta: 1 } },
      { text: 'Big/Deep', score: { kapha: 2 } }
    ]
  },
  {
    id: 8, section: 'A', question: 'Hips',
    options: [
      { text: 'Slender/Thin', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Heavy/Big', score: { kapha: 2 } }
    ]
  },

  // SECTION B
  {
    id: 9, section: 'B', question: 'Nose shape',
    options: [
      { text: 'Uneven/Deviated', score: { vata: 2 } },
      { text: 'Long/Pointed', score: { pitta: 1 } },
      { text: 'Short/Rounded', score: { kapha: 2 } }
    ]
  },
  {
    id: 10, section: 'B', question: 'Eyes',
    options: [
      { text: 'Small/Sunken/Dry', score: { vata: 2 } },
      { text: 'Sharp/Light-sensitive', score: { pitta: 1 } },
      { text: 'Big/Calm', score: { kapha: 2 } }
    ]
  },
  {
    id: 11, section: 'B', question: 'Chin shape',
    options: [
      { text: 'Thin/Angular', score: { vata: 2 } },
      { text: 'Tapering', score: { pitta: 1 } },
      { text: 'Rounded/Double', score: { kapha: 2 } }
    ]
  },
  {
    id: 12, section: 'B', question: 'Cheeks',
    options: [
      { text: 'Wrinkled/Sunken', score: { vata: 2 } },
      { text: 'Smooth/Flat', score: { pitta: 1 } },
      { text: 'Rounded/Plump', score: { kapha: 2 } }
    ]
  },
  {
    id: 13, section: 'B', question: 'Neck',
    options: [
      { text: 'Thin/Tall', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 1 } },
      { text: 'Big/Folded', score: { kapha: 2 } }
    ]
  },

  // SECTION C
  {
    id: 14, section: 'C', question: 'Skin behavior',
    options: [
      { text: 'Thin/Dry/Cold/Bumpy', score: { vata: 2 } },
      { text: 'Temperate/Rosy', score: { pitta: 1 } },
      { text: 'Thick/Oily/Cool', score: { kapha: 2 } }
    ]
  },
  {
    id: 15, section: 'C', question: 'Skin color/complexion',
    options: [
      { text: 'Cracked/Freckled', score: { vata: 2 } },
      { text: 'Fair/Rosy', score: { pitta: 1 } },
      { text: 'Dark/Pale', score: { kapha: 2 } }
    ]
  },
  {
    id: 16, section: 'C', question: 'Hair texture',
    options: [
      { text: 'Dry/Brittle', score: { vata: 2 } },
      { text: 'Straight/Thin', score: { pitta: 1 } },
      { text: 'Thick/Oily/Wavy', score: { kapha: 2 } }
    ]
  },
  {
    id: 17, section: 'C', question: 'Scalp hair issues',
    options: [
      { text: 'Graying/Falling/Breaking', score: { vata: 2 } },
      { text: 'Seasonal change', score: { pitta: 1 } },
      { text: 'None/Thick', score: { kapha: 2 } }
    ]
  },
  {
    id: 18, section: 'C', question: 'Nail texture',
    options: [
      { text: 'Brittle/Cracked', score: { vata: 2 } },
      { text: 'Normal/Flexible', score: { pitta: 1 } },
      { text: 'Smooth/Oily', score: { kapha: 2 } }
    ]
  },
  {
    id: 19, section: 'C', question: 'Lips',
    options: [
      { text: 'Dry/Cracked', score: { vata: 2 } },
      { text: 'Red/Inflamed', score: { pitta: 1 } },
      { text: 'Smooth/Oily', score: { kapha: 2 } }
    ]
  },
  {
    id: 20, section: 'C', question: 'Teeth',
    options: [
      { text: 'Thin gums/Irregular', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'White/Strong', score: { kapha: 2 } }
    ]
  },

  // SECTION D
  {
    id: 21, section: 'D', question: 'Appetite regularity',
    options: [
      { text: 'Irregular', score: { vata: 2 } },
      { text: 'Strong', score: { pitta: 2 } },
      { text: 'Slow/Steady', score: { kapha: 2 } }
    ]
  },
  {
    id: 22, section: 'D', question: 'Appetite frequency',
    options: [
      { text: 'Frequent', score: { pitta: 2 } },
      { text: 'Infrequent', score: { vata: 2 } },
      { text: 'Steady', score: { kapha: 2 } }
    ]
  },
  {
    id: 23, section: 'D', question: 'Taste preference',
    options: [
      { text: 'Sweet/Sour/Salty', score: { kapha: 1, pitta: 1 } },
      { text: 'Sweet/Bitter/Astringent', score: { pitta: 2 } },
      { text: 'Bitter/Pungent/Astringent', score: { vata: 2 } }
    ]
  },
  {
    id: 24, section: 'D', question: 'Preference food temp',
    options: [
      { text: 'Cold', score: { vata: 2 } },
      { text: 'Warm', score: { pitta: 1 } },
      { text: 'Any/None', score: {} }
    ]
  },
  {
    id: 25, section: 'D', question: 'Food quantity on hunger',
    options: [
      { text: 'Low', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 1 } },
      { text: 'High', score: { kapha: 2 } }
    ]
  },
  {
    id: 26, section: 'D', question: 'Ability to digest recent meal',
    options: [
      { text: 'Easy', score: { pitta: 1 } },
      { text: 'Need effort', score: { vata: 1 } },
      { text: 'Always difficult', score: { kapha: 1 } }
    ]
  },
  {
    id: 27, section: 'D', question: 'Preference for fatty foods',
    options: [
      { text: 'Butter/Ghee', score: { kapha: 2, pitta: 1 } },
      { text: 'Animal Fat/Oil', score: { kapha: 2 } },
      { text: 'None', score: {} }
    ]
  },
  {
    id: 28, section: 'D', question: 'Bowel habits',
    options: [
      { text: 'Constipation', score: { vata: 2 } },
      { text: 'Loose motions', score: { pitta: 1 } },
      { text: 'Thick/Sluggish', score: { kapha: 2 } }
    ]
  },
  {
    id: 29, section: 'D', question: 'Stool consistency',
    options: [
      { text: 'Hard', score: { vata: 2 } },
      { text: 'Loose', score: { pitta: 1 } },
      { text: 'Soft/Oily', score: { kapha: 2 } }
    ]
  },

  // SECTION E
  {
    id: 30, section: 'E', question: 'Sleep amount',
    options: [
      { text: 'Less (<6h)', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Heavy (>8h)', score: { kapha: 2 } }
    ]
  },
  {
    id: 31, section: 'E', question: 'Sleep initiation',
    options: [
      { text: 'Immediate', score: { kapha: 1 } },
      { text: 'Takes time', score: { vata: 2 } },
      { text: 'Hard', score: { pitta: 1 } }
    ]
  },
  {
    id: 32, section: 'E', question: 'Sleep quality',
    options: [
      { text: 'Deep', score: { kapha: 2 } },
      { text: 'Moderate/Sound', score: { pitta: 1 } },
      { text: 'Shallow', score: { vata: 2 } }
    ]
  },
  {
    id: 33, section: 'E', question: 'Perspiration level',
    options: [
      { text: 'Profuse', score: { pitta: 2 } },
      { text: 'Moderate', score: {} },
      { text: 'Less', score: { vata: 2 } }
    ]
  },

  // SECTION F
  {
    id: 34, section: 'F', question: 'Mental activity',
    options: [
      { text: 'Hyperactive', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Dull/Slow', score: { kapha: 2 } }
    ]
  },
  {
    id: 35, section: 'F', question: 'Emotional style',
    options: [
      { text: 'Anxiety/Fear', score: { vata: 2 } },
      { text: 'Anger/Jealousy', score: { pitta: 2 } },
      { text: 'Calm/Attachment', score: { kapha: 2 } }
    ]
  },
  {
    id: 36, section: 'F', question: 'IQ/Intellect style',
    options: [
      { text: 'Quick but faulty', score: { vata: 2 } },
      { text: 'Accurate response', score: { pitta: 2 } },
      { text: 'Slow & exact', score: { kapha: 2 } }
    ]
  },
  {
    id: 37, section: 'F', question: 'Recollection type',
    options: [
      { text: 'Recent good/Remote poor', score: { vata: 2 } },
      { text: 'Distinct', score: { pitta: 2 } },
      { text: 'Slow/Sustained', score: { kapha: 2 } }
    ]
  },
  {
    id: 38, section: 'F', question: 'Memory retention',
    options: [
      { text: 'Poor/Variable', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Good/Strong', score: { kapha: 2 } }
    ]
  },
  {
    id: 39, section: 'F', question: 'Speaking amount',
    options: [
      { text: 'Excessive', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Less', score: { kapha: 2 } }
    ]
  },
  {
    id: 40, section: 'F', question: 'Quality of voice',
    options: [
      { text: 'Sharp/High', score: { vata: 2, pitta: 1 } },
      { text: 'Clear/Toned', score: { pitta: 1 } },
      { text: 'Deep/Soft', score: { kapha: 2 } }
    ]
  },
  {
    id: 41, section: 'F', question: 'Speaking style',
    options: [
      { text: 'Quick', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 1 } },
      { text: 'Slow', score: { kapha: 2 } }
    ]
  },

  // SECTION G
  {
    id: 42, section: 'G', question: 'Physical activity',
    options: [
      { text: 'Hyperactive', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Slow', score: { kapha: 2 } }
    ]
  },
  {
    id: 43, section: 'G', question: 'Walking pace',
    options: [
      { text: 'Fast', score: { vata: 2 } },
      { text: 'Medium', score: { pitta: 1 } },
      { text: 'Slow', score: { kapha: 2 } }
    ]
  },
  {
    id: 44, section: 'G', question: 'Preference for routine',
    options: [
      { text: 'Variable', score: { vata: 2 } },
      { text: 'Balanced', score: { pitta: 1 } },
      { text: 'Routine lover', score: { kapha: 2 } }
    ]
  },
  {
    id: 45, section: 'G', question: 'Hand movement',
    options: [
      { text: 'High/Excessive', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Less', score: { kapha: 2 } }
    ]
  },
  {
    id: 46, section: 'G', question: 'Shoulder movement',
    options: [
      { text: 'High/Excessive', score: { vata: 2 } },
      { text: 'Moderate', score: { pitta: 1 } },
      { text: 'Less', score: { kapha: 2 } }
    ]
  },

  // SECTION H
  {
    id: 47, section: 'H', question: 'Body odor',
    options: [
      { text: 'Strong', score: { pitta: 2, kapha: 1 } },
      { text: 'Mild', score: {} },
      { text: 'Very mild', score: { vata: 2 } }
    ]
  },
  {
    id: 48, section: 'H', question: 'Weather preference',
    options: [
      { text: 'Cold', score: { vata: 2 } },
      { text: 'Warm', score: { pitta: 2 } },
      { text: 'Both/All', score: {} }
    ]
  },
  {
    id: 49, section: 'H', question: 'Weather health problems',
    options: [
      { text: 'Affects in Cold', score: { vata: 2 } },
      { text: 'Affects in Warm', score: { pitta: 2 } },
      { text: 'All/None/Seasonal', score: {} }
    ]
  },
  {
    id: 50, section: 'H', question: 'Weight change pattern',
    options: [
      { text: 'Gain easily', score: { kapha: 2 } },
      { text: 'Lose easily', score: { vata: 2 } },
      { text: 'Difficulty in both', score: { pitta: 2 } }
    ]
  }
];
