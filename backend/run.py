import sys
sys.stdout.reconfigure(encoding='utf-8')

import uvicorn
from app.config import PORT

if __name__ == "__main__":
    print(f"\n🚀 Starting CampusGPT FastAPI Server on http://localhost:{PORT}")
    print(f"📖 Interactive API Docs available at http://localhost:{PORT}/docs\n")
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
