import sys
sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import ssl
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

departments = [
    ("Computer Science and Engineering", "https://csed.thapar.edu/faculty", "https://csed.thapar.edu"),
    ("Electronics and Communication Engineering", "https://eced.thapar.edu/faculty", "https://eced.thapar.edu"),
    ("Mechanical Engineering Department", "https://med.thapar.edu/faculty", "https://med.thapar.edu"),
    ("Electrical and Instrumentation Engineering", "https://eied.thapar.edu/faculty", "https://eied.thapar.edu"),
    ("School of Mathematics", "https://som.thapar.edu/faculty", "https://som.thapar.edu"),
    ("Civil Engineering Department", "https://ced.thapar.edu/faculty", "https://ced.thapar.edu"),
    ("School of Physics and Materials Science", "https://spms.thapar.edu/faculty", "https://spms.thapar.edu"),
    ("School of Chemistry and Biochemistry", "https://scbc.thapar.edu/faculty", "https://scbc.thapar.edu"),
    ("Chemical Engineering Department", "https://ched.thapar.edu/faculty", "https://ched.thapar.edu"),
]

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

def scrape_department_faculty(dept_name, url, base_url):
    faculty_list = []
    print(f"▶ Scraping {dept_name} from: {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, context=ssl_context, timeout=8) as resp:
            soup = BeautifulSoup(resp.read(), "html.parser")
            elems = soup.find_all("div", class_="faculty-elem")

            for elem in elems:
                design_div = elem.find("div", class_="faculty-design")
                name_elem = design_div.find("p").find("strong") if design_div and design_div.find("p") else None
                name = name_elem.get_text(strip=True) if name_elem else ""

                if not name:
                    heading = elem.find(["h3", "h4", "h5", "strong"])
                    name = heading.get_text(strip=True) if heading else ""

                if name:
                    # Specialization
                    spec_p = elem.find(lambda tag: tag.name == "p" and "Specialization" in tag.text)
                    spec = ""
                    if spec_p and spec_p.find_next_sibling("p"):
                        spec = spec_p.find_next_sibling("p").get_text(strip=True)

                    # Email
                    email_p = elem.find(lambda tag: tag.name == "p" and "Email" in tag.text)
                    email = ""
                    if email_p and email_p.find_next_sibling("p"):
                        email = email_p.find_next_sibling("p").get_text(strip=True)

                    # Link
                    link_elem = elem.find("a", string=re.compile(r"Read More", re.I))
                    link = link_elem.get("href") if link_elem else ""
                    if link and not link.startswith("http"):
                        link = f"{base_url.rstrip('/')}/{link.lstrip('/')}"
                    if not link:
                        link = url

                    office = f"Dept. Office, {dept_name}"

                    faculty_list.append({
                        "FacultyID": len(faculty_list) + 1,
                        "Name": name,
                        "Department": dept_name,
                        "Specialization": spec or "Teaching & Research",
                        "Office": office,
                        "Email": email or "N/A",
                        "link": link,
                    })

        print(f"  [OK] Collected {len(faculty_list)} faculty members from {dept_name}")
    except Exception as e:
        print(f"  [WARN] Failed to scrape {dept_name}: {e}")

    return faculty_list

def main():
    all_faculty = []
    for dept_name, url, base_url in departments:
        dept_faculty = scrape_department_faculty(dept_name, url, base_url)
        all_faculty.extend(dept_faculty)

    # Re-index Faculty IDs
    for idx, f in enumerate(all_faculty, start=1):
        f["FacultyID"] = idx

    print(f"\n✅ Total Faculty Records Collected: {len(all_faculty)}")

    # Save to data/faculty.json and faculty.json
    out_path1 = BASE_DIR / "data" / "faculty.json"
    out_path2 = BASE_DIR / "faculty.json"

    out_path1.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path1, "w", encoding="utf-8") as f:
        json.dump(all_faculty, f, indent=2, ensure_ascii=False)

    with open(out_path2, "w", encoding="utf-8") as f:
        json.dump(all_faculty, f, indent=2, ensure_ascii=False)

    print(f"💾 Saved {len(all_faculty)} records to {out_path1}")
    print(f"💾 Saved {len(all_faculty)} records to {out_path2}")

    # Also try inserting into MySQL database if running
    try:
        from app.db import get_connection
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS `Faculty` (
                    `FacultyID` INT AUTO_INCREMENT PRIMARY KEY,
                    `Name` VARCHAR(255),
                    `Department` VARCHAR(255),
                    `Specialization` TEXT,
                    `Office` VARCHAR(255),
                    `Email` VARCHAR(255),
                    `link` VARCHAR(500)
                )
            """)
            print("▶ Inserting into MySQL database...")
            cur.execute("TRUNCATE TABLE `Faculty`")
            for f in all_faculty:
                cur.execute(
                    "INSERT INTO `Faculty` (Name, Department, Specialization, Office, Email, link) VALUES (%s, %s, %s, %s, %s, %s)",
                    (f["Name"], f["Department"], f["Specialization"], f["Office"], f["Email"], f["link"])
                )
        conn.close()
        print(f"✅ Successfully inserted {len(all_faculty)} records into MySQL database!")
    except Exception as err:
        print(f"[INFO] MySQL database insertion skipped ({err}). JSON files are ready to serve.")

if __name__ == "__main__":
    main()
