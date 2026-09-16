import sys
sys.stdout.reconfigure(encoding='utf-8')

import asyncio
import httpx
from app.main import app

async def run_tests():
    print("🧪 Running Automated Backend Tests on FastAPI App...\n")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test 1: Root
        r1 = await client.get("/")
        print(f"1. GET / -> Status {r1.status_code}, Response: {r1.json()}")
        assert r1.status_code == 200

        # Test 2: Greeting
        r2 = await client.post("/api/chat", json={"message": "hello"})
        print(f"2. Greeting -> Type: {r2.json().get('type')}")
        assert r2.json().get("type") == "simple_message"

        # Test 3: Timetable
        r3 = await client.post("/api/chat", json={"message": "2C24 timetable Monday"})
        print(f"3. Timetable -> Type: {r3.json().get('type')}, Slots: {len(r3.json().get('data', {}).get('schedule', []))}")
        assert r3.json().get("type") == "timetable_display"
        assert len(r3.json().get("data", {}).get("schedule", [])) > 0

        # Test 4: Faculty
        r4 = await client.post("/api/chat", json={"message": "Dr. Raj Kumar Gupta"})
        print(f"4. Faculty -> Type: {r4.json().get('type')}, Matches: {len(r4.json().get('data', []))}")
        assert r4.json().get("type") == "faculty_info"
        assert len(r4.json().get("data", [])) > 0

        # Test 5: Subject
        r5 = await client.post("/api/chat", json={"message": "UCS312"})
        print(f"5. Subject -> Type: {r5.json().get('type')}, Name: {r5.json().get('data', {}).get('name')}")
        assert r5.json().get("type") == "subject_info"

        # Test 6: Cafeteria
        r6 = await client.post("/api/chat", json={"message": "Pizza Nation menu"})
        print(f"6. Cafeteria -> Type: {r6.json().get('type')}, Name: {r6.json().get('data', {}).get('name')}")
        assert r6.json().get("type") == "cafeteria_info"

        # Test 7: DoAA
        r7 = await client.post("/api/chat", json={"message": "how to change group?"})
        print(f"7. DoAA -> Type: {r7.json().get('type')}")
        assert r7.json().get("type") == "simple_message"
        assert "Regarding" in r7.json().get("response", "")

        # Test 8: Certificate
        r8 = await client.post("/api/chat", json={"message": "gap year affidavit"})
        print(f"8. Certificate -> Type: {r8.json().get('type')}")
        assert r8.json().get("type") == "simple_message"
        assert "Gap" in r8.json().get("response", "")

        # Test 9: Dispensary
        r9 = await client.post("/api/chat", json={"message": "dispensary hours"})
        print(f"9. Dispensary -> Type: {r9.json().get('type')}, Phone: {r9.json().get('data', {}).get('phone')}")
        assert r9.json().get("type") == "dispensary_info"

        # Test 10: DoAA Procedures list
        r10 = await client.get("/api/chat/doaa-procedures")
        print(f"10. DoAA Procedures List -> Count: {len(r10.json())}")
        assert len(r10.json()) >= 12

    print("\n🎉 ALL 10 BACKEND TESTS PASSED SUCCESSFULLY! ✅")

if __name__ == "__main__":
    asyncio.run(run_tests())
