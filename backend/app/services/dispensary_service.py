from typing import Dict, Any

dispensary_data = {
    "name": "Thapar University Health Centre",
    "location": "Behind LP/LT building (check navigation for more info)",
    "hours": [
        {"days": "Monday - Friday", "times": "9:30 AM - 2:00 AM & 2:00 PM - 6:00 AM"},
        {"days": "Saturday", "times": "10:00 AM - 2:00 PM & 3:00 PM - 7:00 PM & 8:00 PM - 2:00 AM"},
        {"days": "Sunday", "times": "10:00 AM - 2:00 PM & 10:00 PM & 6:00 AM"}
    ],
    "phone": "8288008122",
}

def get_dispensary_info() -> Dict[str, Any]:
    return dispensary_data
