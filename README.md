# DSA Visualizer

A modern, interactive Data Structures and Algorithms visualizer for learning purposes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)

## 🚀 Features

- **25+ Algorithms** with step-by-step visualization
- **Interactive Controls** - Play, pause, step through at your own pace
- **Modern Dark UI** with glassmorphism effects
- **Multiple Categories**: Sorting, Searching, Graph, Tree, Dynamic Programming
- **Real-time Statistics** - Comparisons, swaps, and complexity analysis

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Algorithm Engine | Python FastAPI |
| WebSocket Server | Node.js + Socket.io |
| Auth & Progress | Django |
| CI/CD | GitHub Actions |
| Containerization | Docker |

## 🏃 Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up
```

### Option 2: Manual Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**FastAPI Backend:**
```bash
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

**Node.js WebSocket:**
```bash
cd backend/node
npm install
npm start
```

**Django Auth:**
```bash
cd backend/django
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py runserver 8001
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| FastAPI Docs | http://localhost:8000/docs |
| WebSocket | ws://localhost:3001 |
| Django Admin | http://localhost:8001/admin |

## 📊 Supported Algorithms

### Sorting
- Bubble Sort, Selection Sort, Insertion Sort
- Merge Sort, Quick Sort, Heap Sort
- Counting Sort, Radix Sort

### Searching
- Linear Search, Binary Search
- Jump Search, Interpolation Search, Exponential Search

### Graph
- BFS, DFS
- Dijkstra's Algorithm
- Kruskal's MST, Prim's MST

### Tree
- Inorder, Preorder, Postorder, Level-order Traversal
- BST Insert, Search, Delete

### Dynamic Programming
- Fibonacci
- 0/1 Knapsack
- Longest Common Subsequence (LCS)
- Longest Increasing Subsequence (LIS)

## 🧪 CI/CD

GitHub Actions workflows are configured for:
- Frontend: Lint, Type-check, Test, Build
- FastAPI: Lint, Test, Docker build
- Node.js: Lint, Test
- Django: Migration check, Tests

## 📝 License

MIT License - feel free to use this for learning!
