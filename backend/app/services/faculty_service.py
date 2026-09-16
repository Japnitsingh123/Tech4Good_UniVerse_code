import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.db import query_faculty_db

fallback_faculty: List[Dict[str, Any]] = []

def load_fallback_faculty():
    global fallback_faculty
    if fallback_faculty:
        return

    current_dir = Path(__file__).resolve().parent
    possible_paths = [
        current_dir.parent.parent / "data" / "faculty.json",
        current_dir.parent.parent / "faculty.json",
        Path("backend/data/faculty.json"),
        Path("data/faculty.json"),
        Path("faculty.json"),
    ]

    for p in possible_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    fallback_faculty = json.load(f)
                print(f"[OK] Loaded {len(fallback_faculty)} local faculty records from {p}")
                return
            except Exception as e:
                print(f"Error loading local faculty from {p}: {e}")

# Initial load
load_fallback_faculty()

async def search_faculty(raw_query: str) -> Optional[List[Dict[str, Any]]]:
    if not raw_query:
        return None

    query = raw_query.strip().lower()
    cleaned_terms_str = re.sub(
        r"\b(dr|prof|professor|mr|ms|mrs|sir|madam|faculty|teacher)\.?\b",
        "",
        query,
        flags=re.IGNORECASE,
    ).strip()
    cleaned_search_terms = [w for w in re.split(r"\s+", cleaned_terms_str) if len(w) > 1]
    terms_to_search = cleaned_search_terms if cleaned_search_terms else [query]

    # 1. Try MySQL Database first
    db_results = query_faculty_db(terms_to_search)
    if db_results:
        return db_results

    # 2. Fallback to local faculty database
    load_fallback_faculty()
    if not fallback_faculty:
        return None

    matches = []
    for f in fallback_faculty:
        name_lower = (f.get("Name") or "").lower()
        dept_lower = (f.get("Department") or "").lower()
        spec_lower = (f.get("Specialization") or "").lower()
        email_lower = (f.get("Email") or "").lower()
        office_lower = (f.get("Office") or "").lower()

        # Check full query
        if (
            query in name_lower
            or query in dept_lower
            or query in spec_lower
            or query in email_lower
            or query in office_lower
        ):
            matches.append(f)
            continue

        # Check terms
        if cleaned_search_terms and all(
            term in name_lower
            or term in dept_lower
            or term in spec_lower
            or term in email_lower
            or term in office_lower
            for term in cleaned_search_terms
        ):
            matches.append(f)

    if matches:
        return matches

    # Partial match across terms
    if len(cleaned_search_terms) > 1:
        partial_matches = [
            f for f in fallback_faculty
            if any(term in (f.get("Name") or "").lower() for term in cleaned_search_terms)
        ]
        if partial_matches:
            return partial_matches

    return None
