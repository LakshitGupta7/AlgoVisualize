from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import sorting, searching, graph, tree, dp
from models.schemas import AlgorithmInfo

app = FastAPI(
    title="DSA Visualizer API",
    description="Backend API for Data Structures and Algorithms Visualization",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sorting.router, prefix="/api/v1/sorting", tags=["Sorting"])
app.include_router(searching.router, prefix="/api/v1/searching", tags=["Searching"])
app.include_router(graph.router, prefix="/api/v1/graph", tags=["Graph"])
app.include_router(tree.router, prefix="/api/v1/tree", tags=["Tree"])
app.include_router(dp.router, prefix="/api/v1/dp", tags=["Dynamic Programming"])


@app.get("/")
async def root():
    return {"message": "DSA Visualizer API", "version": "1.0.0"}


@app.get("/api/v1/algorithms", response_model=list[AlgorithmInfo])
async def get_all_algorithms():
    """Get list of all available algorithms"""
    algorithms = [
        # Sorting
        AlgorithmInfo(name="Bubble Sort", category="sorting", complexity_time="O(n²)", complexity_space="O(1)"),
        AlgorithmInfo(name="Selection Sort", category="sorting", complexity_time="O(n²)", complexity_space="O(1)"),
        AlgorithmInfo(name="Insertion Sort", category="sorting", complexity_time="O(n²)", complexity_space="O(1)"),
        AlgorithmInfo(name="Merge Sort", category="sorting", complexity_time="O(n log n)", complexity_space="O(n)"),
        AlgorithmInfo(name="Quick Sort", category="sorting", complexity_time="O(n log n)", complexity_space="O(log n)"),
        AlgorithmInfo(name="Heap Sort", category="sorting", complexity_time="O(n log n)", complexity_space="O(1)"),
        AlgorithmInfo(name="Radix Sort", category="sorting", complexity_time="O(nk)", complexity_space="O(n+k)"),
        AlgorithmInfo(name="Counting Sort", category="sorting", complexity_time="O(n+k)", complexity_space="O(k)"),
        
        # Searching
        AlgorithmInfo(name="Linear Search", category="searching", complexity_time="O(n)", complexity_space="O(1)"),
        AlgorithmInfo(name="Binary Search", category="searching", complexity_time="O(log n)", complexity_space="O(1)"),
        AlgorithmInfo(name="Jump Search", category="searching", complexity_time="O(√n)", complexity_space="O(1)"),
        
        # Graph
        AlgorithmInfo(name="BFS", category="graph", complexity_time="O(V+E)", complexity_space="O(V)"),
        AlgorithmInfo(name="DFS", category="graph", complexity_time="O(V+E)", complexity_space="O(V)"),
        AlgorithmInfo(name="Dijkstra", category="graph", complexity_time="O((V+E)logV)", complexity_space="O(V)"),
        AlgorithmInfo(name="Bellman-Ford", category="graph", complexity_time="O(VE)", complexity_space="O(V)"),
        AlgorithmInfo(name="Kruskal", category="graph", complexity_time="O(E log E)", complexity_space="O(V)"),
        AlgorithmInfo(name="Prim", category="graph", complexity_time="O((V+E)logV)", complexity_space="O(V)"),
        
        # Tree
        AlgorithmInfo(name="Inorder Traversal", category="tree", complexity_time="O(n)", complexity_space="O(h)"),
        AlgorithmInfo(name="Preorder Traversal", category="tree", complexity_time="O(n)", complexity_space="O(h)"),
        AlgorithmInfo(name="Postorder Traversal", category="tree", complexity_time="O(n)", complexity_space="O(h)"),
        AlgorithmInfo(name="Level Order Traversal", category="tree", complexity_time="O(n)", complexity_space="O(w)"),
        AlgorithmInfo(name="BST Insert", category="tree", complexity_time="O(log n)", complexity_space="O(1)"),
        AlgorithmInfo(name="BST Delete", category="tree", complexity_time="O(log n)", complexity_space="O(1)"),
        
        # Dynamic Programming
        AlgorithmInfo(name="Fibonacci", category="dp", complexity_time="O(n)", complexity_space="O(n)"),
        AlgorithmInfo(name="Knapsack", category="dp", complexity_time="O(nW)", complexity_space="O(nW)"),
        AlgorithmInfo(name="LCS", category="dp", complexity_time="O(mn)", complexity_space="O(mn)"),
        AlgorithmInfo(name="LIS", category="dp", complexity_time="O(n log n)", complexity_space="O(n)"),
    ]
    return algorithms


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
