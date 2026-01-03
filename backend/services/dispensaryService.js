// backend/services/dispensaryService.js

// This object holds all the information for the dispensary.
// --- UPDATE THIS DATA ---
const dispensaryData = {
  name: "Thapar University Health Centre",
  location: "Behind LP/LT building (check navigation for more info)",
  hours: [
    { days: "Monday - Friday", times: "9:30 AM - 2:00 AM & 2:00 PM - 6:00 AM" },
    { days: "Saturday", times: "10:00 AM - 2:00 PM & 3:00 PM - 7:00 PM & 8:00 PM - 2:00 AM" },
    { days: "Sunday", times: "10:00 AM - 2:00 PM & 10:00 PM & 6:00 AM" }
  ],
  phone: "8288008122",
  
};
// --- END OF DATA TO UPDATE ---

/**
 * Returns the hardcoded dispensary information.
 */
export function getDispensaryInfo() {
  return dispensaryData;
}