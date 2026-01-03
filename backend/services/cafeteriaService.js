// backend/services/cafeteriaService.js

// --- UPDATE THIS DATA ---
const cafeteriaData = [
  {
    name: "Pizza Nation",
    keywords: ["pizza", "pizza nation", "nation", "menu"],
    menuImageUrl: "https://i.ibb.co/LzWrk0NY/pizza-Nation-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/JFHbQHtX/pizza-Nation-scanner.jpg", // <-- REPLACE
  },
  {
    name: "Dessert Club Menu",
    keywords: ["dessert", "dessert club"],
    menuImageUrl: "https://i.ibb.co/4ZHyv39Y/dessert-Club-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/sp2kWRgN/dessert-Club-scanner.jpg", // <-- REPLACE
  },
  {
    name: "Chilli Chitkara",
    keywords: ["chilli", "chilli chitkara", "chitkara"],
    menuImageUrl: "https://i.ibb.co/xqPNmDy1/chilli-Chitkara-menu.jpg", // <-- REPLACE
    scannerImageUrl: "aksgf", // <-- REPLACE
  },
  {
    name: "G-Block",
    keywords: ["g block", "g-block"],
    menuImageUrl: "https://i.ibb.co/S4d8Px6b/GBlock-Canteen-menu.jpg", // <-- REPLACE
    scannerImageUrl: "kahsgf", // <-- REPLACE
  },
  {
    name: "Jaggi Samosa Shop",
    keywords: ["samosa", "jaggi samosa", "royal bite"],
    menuImageUrl: "https://i.ibb.co/tMXZhL4b/Jaggi-Samosa-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/d4D6LQC1/jaggi-Samosa-scanner.jpg", // <-- REPLACE
  },
  {
    name: "Jaggi Juice Shop",
    keywords: [
      "juice",
      "jaggi juice",
      "jeona khan",
      "juice",
      "fruit",
      "fruits",
    ],
    menuImageUrl: "https://i.ibb.co/27KVvyws/jaggi-Juice-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/d0G2MQbQ/jaggi-Juice-scanner.jpg", // <-- REPLACE
  },
  {
    name: "Sips and bite",
    keywords: ["sips", "sips and bite", "sip and bite"],
    menuImageUrl: "https://i.ibb.co/5fv8Tz3/sips-And-Bites-menu.jpg", // <-- REPLACE
    scannerImageUrl: "kjsdf", // <-- REPLACE
  },
  {
    name: "Cos All Shops",
    keywords: ["cos", "cos shops", "cos info", "shop", "shops"],
    menuImageUrl: "https://i.ibb.co/DDJgvTm3/cos.jpg", // <-- REPLACE
    scannerImageUrl: "kjsdf", // <-- REPLACE
  },
  {
    name: "Academic Calander",
    keywords: ["academic calander", "calander"],
    menuImageUrl:
      "https://i.ibb.co/C32KHmWy/Screenshot-2025-11-04-at-1-56-16-AM.png", // <-- REPLACE
  },
  {
    name: "Nascafe",
    keywords: ["Nescafe Menu", "Nescafe", "nescafe"],
    menuImageUrl: "https://i.ibb.co/WNqDTVPJ/Nescafe-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/GvkkgVrQ/Nescafe-scannar.jpg",
  },
  {
    name: "Campus Bite",
    keywords: ["Campus bite", "bite", "campusbite"],
    menuImageUrl: "https://i.ibb.co/HWWtx26/Campusbite-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/Swwh301L/Campusbite-scanner.jpg",
  },
  {
    name: "Amritsari Naan",
    keywords: ["Amritsari", "Naan", "amritsari naan"],
    menuImageUrl: "https://i.ibb.co/23ZLKsgv/Amritsari-kulcha-naan-Menu.jpg", // <-- REPLACE
    scannerImageUrl:
      "https://i.ibb.co/q3KYXHP0/Amritsari-kulcha-naan-scannar.jpg",
  },
  {
    name: "Jaggi Cold Coffee",
    keywords: ["Jaggi", "cold coffee", "Surinder ice cream parlour and shakes"],
    menuImageUrl: "https://i.ibb.co/mrLnpShQ/Jaggi-cold-coffee-menu.jpg", // <-- REPLACE
    scannerImageUrl: "https://i.ibb.co/wFsdcDGG/Jaggi-cold-coffee-scanner.jpg",
  },
  {
    name: "TSLAS Back Canteen",
    keywords: ["tslas canteen", "tslas back", "near tslas"],
    menuImageUrl: "https://i.ibb.co/B5zp13Wk/Taslas-Backside-menu.jpg", // <-- REPLACE
    scannerImageUrl: "kjsdf", // <-- REPLACE
  },
];
// --- END OF DATA TO UPDATE ---

/**
 * Finds a cafeteria based on keywords in the prompt.
 */
export function findCafeteria(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  // Find the first cafe where one of its keywords is in the prompt
  return cafeteriaData.find((cafe) =>
    cafe.keywords.some((kw) => lowerPrompt.includes(kw))
  );
}

/**
 * Returns a list of all available cafeteria names.
 */
export function listAllCafes() {
  return cafeteriaData.map((cafe) => cafe.name);
}

/**
 * Returns all keywords for all cafes, for use in analyzePrompt.
 */
export function getAllCafeKeywords() {
  const allKeywords = new Set(["cafe", "canteen", "scanner"]);
  cafeteriaData.forEach((cafe) => {
    cafe.keywords.forEach((kw) => allKeywords.add(kw));
  });
  return Array.from(allKeywords);
}
