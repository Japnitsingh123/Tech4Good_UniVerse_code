import os
import ssl
from pathlib import Path
from typing import Optional, List, Dict, Any
import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "Kunal1710")
DB_NAME = os.getenv("DB_NAME", "campusgpt")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_SSL = os.getenv("DB_SSL", "false").lower() == "true"
DB_SSL_CA = os.getenv("DB_SSL_CA", "")

ssl_context = None
if DB_SSL:
    try:
        ssl_context = ssl.create_default_context(cafile=DB_SSL_CA if os.path.exists(DB_SSL_CA) else None)
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
    except Exception as err:
        print(f"[WARN] Failed to load SSL certificate: {err}")

_is_db_reachable = None

def get_connection():
    """
    Creates and returns a MySQL database connection.
    """
    connect_kwargs = {
        "host": DB_HOST,
        "user": DB_USER,
        "password": DB_PASS,
        "database": DB_NAME,
        "port": DB_PORT,
        "cursorclass": DictCursor,
        "autocommit": True,
        "connect_timeout": 1,
    }
    if ssl_context:
        connect_kwargs["ssl"] = ssl_context

    return pymysql.connect(**connect_kwargs)

def query_faculty_db(search_terms: List[str]) -> Optional[List[Dict[str, Any]]]:
    """
    Searches the MySQL Faculty table using LIKE queries.
    """
    global _is_db_reachable
    if not search_terms:
        return None

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            where_clauses = []
            params = []
            for term in search_terms:
                term_like = f"%{term.lower()}%"
                where_clauses.append(
                    "(LOWER(Name) LIKE %s OR LOWER(Department) LIKE %s OR LOWER(Email) LIKE %s OR LOWER(Office) LIKE %s)"
                )
                params.extend([term_like, term_like, term_like, term_like])

            where_sql = " AND ".join(where_clauses)
            sql = f"SELECT * FROM `Faculty` WHERE {where_sql} LIMIT 25"

            cursor.execute(sql, tuple(params))
            results = cursor.fetchall()
            conn.close()
            _is_db_reachable = True

            if results:
                print(f"[OK] Found {len(results)} faculty records from MySQL database")
                return list(results)
    except Exception as err:
        _is_db_reachable = False

    return None

def test_db_connection() -> bool:
    global _is_db_reachable
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
        conn.close()
        _is_db_reachable = True
        print("[OK] MySQL database connected successfully!")
        return True
    except Exception as err:
        _is_db_reachable = False
        print(f"[INFO] MySQL server is currently offline or unreachable on {DB_HOST}:{DB_PORT}. Local faculty knowledge base (546 records) is active.")
        return False
