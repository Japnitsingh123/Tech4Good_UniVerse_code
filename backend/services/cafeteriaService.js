// backend/services/cafeteriaService.js

const cafeteriaData = [
  {
    name: "Pizza Nation",
    keywords: ["pizza", "pizza nation", "nation", "pizza nation menu"],
    menuImageUrl: "https://i.ibb.co/LzWrk0NY/pizza-Nation-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/JFHbQHtX/pizza-Nation-scanner.jpg",
  },
  {
    name: "Dessert Club",
    keywords: ["dessert", "dessert club", "ice cream", "waffle", "sweet", "dessert club menu"],
    menuImageUrl: "https://i.ibb.co/4ZHyv39Y/dessert-Club-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/sp2kWRgN/dessert-Club-scanner.jpg",
  },
  {
    name: "Chilli Chitkara",
    keywords: ["chilli", "chilli chitkara", "chitkara", "chinese", "chilli chatkara"],
    menuImageUrl: "https://i.ibb.co/xqPNmDy1/chilli-Chitkara-menu.jpg",
    scannerImageUrl: "",
  },
  {
    name: "G-Block Canteen",
    keywords: ["g block", "g-block", "gblock", "g block canteen"],
    menuImageUrl: "https://i.ibb.co/S4d8Px6b/GBlock-Canteen-menu.jpg",
    scannerImageUrl: "",
  },
  {
    name: "Jaggi Samosa Shop",
    keywords: ["samosa", "jaggi samosa", "royal bite", "jaggi snacks"],
    menuImageUrl: "https://i.ibb.co/tMXZhL4b/Jaggi-Samosa-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/d4D6LQC1/jaggi-Samosa-scanner.jpg",
  },
  {
    name: "Jaggi Juice Shop",
    keywords: ["juice", "jaggi juice", "shakes", "fruit juice", "fresh juice", "jeona khan"],
    menuImageUrl: "https://i.ibb.co/27KVvyws/jaggi-Juice-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/d0G2MQbQ/jaggi-Juice-scanner.jpg",
  },
  {
    name: "Sips and Bites",
    keywords: ["sips", "sips and bite", "sips and bites", "sip and bite", "sips & bites"],
    menuImageUrl: "https://i.ibb.co/5fv8Tz3/sips-And-Bites-menu.jpg",
    scannerImageUrl: "",
  },
  {
    name: "COS All Shops",
    keywords: ["cos", "cos shops", "cos info", "cos market", "cos complex"],
    menuImageUrl: "https://i.ibb.co/DDJgvTm3/cos.jpg",
    scannerImageUrl: "",
  },
  {
    name: "Academic Calendar",
    keywords: ["academic calendar", "calendar", "academic calander", "schedule calendar"],
    menuImageUrl: "https://i.ibb.co/C32KHmWy/Screenshot-2025-11-04-at-1-56-16-AM.png",
    scannerImageUrl: "",
  },
  {
    name: "Nescafe",
    keywords: ["nescafe", "nascafe", "nescafe menu", "coffee", "tea"],
    menuImageUrl: "https://i.ibb.co/WNqDTVPJ/Nescafe-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/GvkkgVrQ/Nescafe-scannar.jpg",
  },
  {
    name: "Campus Bite",
    keywords: ["campus bite", "bite", "campusbite", "fast food"],
    menuImageUrl: "https://i.ibb.co/HWWtx26/Campusbite-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/Swwh301L/Campusbite-scanner.jpg",
  },
  {
    name: "Amritsari Naan",
    keywords: ["amritsari", "naan", "amritsari naan", "kulcha", "amritsari kulcha"],
    menuImageUrl: "https://i.ibb.co/23ZLKsgv/Amritsari-kulcha-naan-Menu.jpg",
    scannerImageUrl: "https://i.ibb.co/q3KYXHP0/Amritsari-kulcha-naan-scannar.jpg",
  },
  {
    name: "Jaggi Cold Coffee",
    keywords: ["cold coffee", "jaggi cold coffee", "surinder ice cream", "shakes"],
    menuImageUrl: "https://i.ibb.co/mrLnpShQ/Jaggi-cold-coffee-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/wFsdcDGG/Jaggi-cold-coffee-scanner.jpg",
  },
  {
    name: "TSLAS Back Canteen",
    keywords: ["tslas canteen", "tslas back", "tslas", "near tslas"],
    menuImageUrl: "https://i.ibb.co/B5zp13Wk/Taslas-Backside-menu.jpg",
    scannerImageUrl: "",
  },
  {
    name: "Aahar Canteen",
    keywords: ["aahar", "ahaar", "aahar canteen"],
    menuImageUrl: "https://i.ibb.co/S4d8Px6b/GBlock-Canteen-menu.jpg",
    scannerImageUrl: "",
  }
];

export function findCafeteria(prompt) {
  if (!prompt) return null;
  const lowerPrompt = prompt.toLowerCase().trim();

  // 1. Exact or partial match on name
  let cafe = cafeteriaData.find(
    (c) => c.name.toLowerCase() === lowerPrompt || lowerPrompt.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(lowerPrompt)
  );
  if (cafe) return cafe;

  // 2. Keyword match
  cafe = cafeteriaData.find((c) =>
    c.keywords.some((kw) => lowerPrompt.includes(kw.toLowerCase()))
  );
  if (cafe) return cafe;

  return null;
}

export function listAllCafes() {
  return cafeteriaData.map((cafe) => cafe.name);
}

export function getAllCafeKeywords() {
  const allKeywords = new Set(["cafe", "canteen", "cafeteria", "scanner", "menu", "food", "snacks"]);
  cafeteriaData.forEach((cafe) => {
    cafe.keywords.forEach((kw) => allKeywords.add(kw));
    allKeywords.add(cafe.name.toLowerCase());
  });
  return Array.from(allKeywords);
}
