# FastAPI Backend for DSA Visualizer

## Setup
```bash
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints
- `POST /api/v1/sorting/{algorithm}` - Execute sorting with steps
- `POST /api/v1/graph/{algorithm}` - Execute graph algorithms
- `POST /api/v1/tree/{algorithm}` - Execute tree operations
- `GET /api/v1/algorithms` - List all algorithms
