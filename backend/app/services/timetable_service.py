import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

timetable: List[Dict[str, Any]] = []

def parse_course_info(course_info_str: str) -> Dict[str, str]:
    parts = [p for p in course_info_str.strip().split(" ") if p]
    subject = "N/A"
    type_ = "N/A"
    room = "N/A"

    if not parts:
        return {"subject": subject, "type": type_, "room": room}

    room = parts.pop()

    if parts and parts[-1].upper() in ["L", "P", "T"]:
        type_ = parts.pop().upper()

    subject = " ".join(parts)

    if not subject and room != "N/A":
        subject = room
        room = "N/A"

    if not subject:
        subject = "N/A"

    return {"subject": subject, "type": type_, "room": room}

def load_timetable_data():
    global timetable
    timetable.clear()

    current_dir = Path(__file__).resolve().parent
    possible_paths = [
        current_dir.parent.parent / "timetable-data.json",
        current_dir.parent.parent.parent / "timetable-data.json",
        Path("timetable-data.json"),
        Path("backend/timetable-data.json"),
    ]

    for p in possible_paths:
        if p.exists():
            try:
                print(f"▶ Loading timetable data from: {p}")
                with open(p, "r", encoding="utf-8") as f:
                    all_data = json.load(f)

                for category, batches in all_data.items():
                    if not isinstance(batches, dict):
                        continue
                    for batch_code, grid in batches.items():
                        if not isinstance(grid, list) or len(grid) < 2:
                            continue

                        header_row = grid[0]
                        days = [cell.get("course", "").strip() for cell in header_row[1:]]

                        for time_row in grid[1:]:
                            if not time_row or not isinstance(time_row, list):
                                continue
                            time_slot = time_row[0].get("course", "").strip()

                            for j in range(1, len(time_row)):
                                if j - 1 < len(days):
                                    day = days[j - 1]
                                    cell = time_row[j]
                                    if day and cell and isinstance(cell, dict) and cell.get("course", "").strip():
                                        course_info_str = cell.get("course", "").strip()
                                        parsed = parse_course_info(course_info_str)

                                        clean_group = re.sub(r"[^A-Za-z0-9]", "", batch_code.strip().upper())
                                        timetable.append({
                                            "group": clean_group,
                                            "rawGroup": batch_code.strip().upper(),
                                            "branch": category.upper(),
                                            "day": day.strip(),
                                            "time": time_slot,
                                            "subject": parsed["subject"],
                                            "type": parsed["type"],
                                            "room": parsed["room"],
                                        })

                print(f"[OK] Successfully loaded and flattened {len(timetable)} timetable entries.")
                return
            except Exception as err:
                print(f"[ERROR] Error parsing timetable file at {p}: {err}")

    print("[WARN] Could not find 'timetable-data.json'.")

def get_schedule_for_batch(batch_name: str, target_day: Optional[str] = None) -> Dict[str, Any]:
    global timetable
    if not timetable:
        load_timetable_data()

    if not timetable:
        return {"error": "Sorry, the timetable database is currently empty."}

    if not batch_name or not batch_name.strip():
        return {"error": "Please provide a valid batch code, such as 2C24 or 1A11."}

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    if target_day:
        clean_day = target_day.strip().lower()
        matched_day = next((d for d in days if d.lower() == clean_day or d.lower().startswith(clean_day[:3])), None)
        day_to_fetch = matched_day or (target_day[:1].upper() + target_day[1:].lower())
    else:
        # weekday(): Monday is 0, Sunday is 6
        # In JS: Sunday is 0, Monday is 1
        now = datetime.now()
        weekday_idx = (now.weekday() + 1) % 7 # Map to Sunday=0..Saturday=6
        day_to_fetch = "Monday" if weekday_idx == 0 else days[weekday_idx]

    day_string = f"on {day_to_fetch}" if target_day else f"for today ({day_to_fetch})"
    clean_batch = re.sub(r"[^A-Za-z0-9]", "", batch_name.strip().upper())

    todays_schedule = [
        slot for slot in timetable
        if slot["group"] == clean_batch and slot["day"].lower() == day_to_fetch.lower()
    ]

    is_valid_batch = any(slot["group"] == clean_batch for slot in timetable)

    if not todays_schedule:
        if is_valid_batch:
            return {
                "title": f"Schedule for **{batch_name.upper()}** {day_string}",
                "schedule": [
                    {
                        "time": "All Day",
                        "subject": "No classes scheduled / Off day",
                        "type": "Free",
                        "room": "N/A",
                    }
                ],
            }
        else:
            sample_batches = ", ".join(list({s["rawGroup"] for s in timetable})[:6])
            return {
                "error": f'Sorry, I couldn\'t find any batch matching "{batch_name}". Try one of: {sample_batches}'
            }

    # Sort schedule by time
    def time_sort_key(slot):
        t = slot.get("time", "")
        # convert e.g. "08:00 AM", "01:00 PM" into sortable 24-hr tuple
        try:
            match = re.search(r"(\d+):(\d+)\s*(AM|PM)?", t, re.IGNORECASE)
            if match:
                hour = int(match.group(1))
                minute = int(match.group(2))
                meridiem = (match.group(3) or "").upper()
                if meridiem == "PM" and hour < 12:
                    hour += 12
                elif meridiem == "AM" and hour == 12:
                    hour = 0
                return (hour, minute)
        except Exception:
            pass
        return (0, 0)

    schedule_sorted = sorted(todays_schedule, key=time_sort_key)

    return {
        "title": f"Schedule for **{batch_name.upper()}** {day_string}",
        "schedule": schedule_sorted,
    }
