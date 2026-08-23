/**
 * Multilingual Speech Number Parser for English, Hindi, and Marathi
 */

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

const WORD_TO_NUMBER: Record<string, number> = {
  // English
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  lakh: 100000,
  crore: 10000000,

  // Hindi
  शून्य: 0,
  एक: 1,
  दो: 2,
  तीन: 3,
  चार: 4,
  पांच: 5,
  पाँच: 5,
  छह: 6,
  सात: 7,
  आठ: 8,
  नौ: 9,
  दस: 10,
  ग्यारह: 11,
  बारह: 12,
  तेरह: 13,
  चौदह: 14,
  पंद्रह: 15,
  सोलह: 16,
  सत्रह: 17,
  अठारह: 18,
  उन्नीस: 19,
  बीस: 20,
  पच्चीस: 25,
  तीस: 30,
  पैंतीस: 35,
  चालीस: 40,
  पैंतालीस: 45,
  पचास: 50,
  साठ: 60,
  सत्तर: 70,
  अस्सी: 80,
  नब्बे: 90,
  सौ: 100,
  'डेढ़ सौ': 150,
  डेढ़सौ: 150,
  'ढाई सौ': 250,
  ढाईसौ: 250,
  'साढ़े तीन सौ': 350,
  'पांच सौ': 500,
  हजार: 1000,
  हज़ार: 1000,
  लाख: 100000,
  करोड़: 10000000,

  // Marathi
  दोन: 2,
  पाच: 5,
  सहा: 6,
  दहा: 10,
  अकरा: 11,
  बारा: 12,
  तेरा: 13,
  चौदा: 14,
  पंधरा: 15,
  सोळा: 16,
  सतरा: 17,
  अठरा: 18,
  एकोणीस: 19,
  वीस: 20,
  पंचवीस: 25,
  पस्तीस: 35,
  चाळीस: 40,
  पंचेचाळीस: 45,
  पन्नास: 50,
  शंभर: 100,
  दीडशे: 150,
  'दीड शे': 150,
  अडीचशे: 250,
  'अडीच शे': 250,
  साडेतीनशे: 350,
  पाचशे: 500,
  कोटी: 10000000,
};

export function parseSpokenNumber(rawText: string): number | null {
  if (!rawText || !rawText.trim()) return null;

  let text = rawText.toLowerCase().trim();

  // Convert Devanagari digits to standard digits
  for (const [dev, ascii] of Object.entries(DEVANAGARI_DIGITS)) {
    text = text.replaceAll(dev, ascii);
  }

  // Remove common currency/unit noise words
  text = text.replace(/(rupees|rupee|rs|inr|रुपये|रुपया|रू|रु|नग|units|unit|pieces|piece|bucks)/gi, ' ').trim();

  // 1. Direct regex match for standard integers or decimals (e.g. "250", "599.50", "40")
  const directMatch = text.match(/-?\d+(\.\d+)?/);
  if (directMatch) {
    const val = parseFloat(directMatch[0]);
    if (!isNaN(val)) return val;
  }

  // 2. Check compound phrases
  for (const [word, val] of Object.entries(WORD_TO_NUMBER)) {
    if (text.includes(word)) {
      return val;
    }
  }

  return null;
}
