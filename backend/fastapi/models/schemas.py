from pydantic import BaseModel
from typing import Any, Optional


class AlgorithmInfo(BaseModel):
    name: str
    category: str
    complexity_time: str
    complexity_space: str
    description: Optional[str] = None


class SortingRequest(BaseModel):
    array: list[int]
    speed: Optional[int] = 50  # Animation speed


class SortingStep(BaseModel):
    array: list[int]
    comparing: Optional[list[int]] = None  # Indices being compared
    swapping: Optional[list[int]] = None   # Indices being swapped
    sorted: list[int] = []                 # Already sorted indices
    pivot: Optional[int] = None            # Pivot index for quick sort
    buckets: Optional[list[list[int]]] = None  # Buckets for bucket sort
    description: str


class SortingResponse(BaseModel):
    algorithm: str
    steps: list[SortingStep]
    total_comparisons: int
    total_swaps: int


class SearchingRequest(BaseModel):
    array: list[int]
    target: int


class SearchingStep(BaseModel):
    array: list[int]
    current: Optional[int] = None         # Current index being checked
    left: Optional[int] = None            # Left boundary
    right: Optional[int] = None           # Right boundary
    mid: Optional[int] = None             # Mid index (binary search)
    found: bool = False
    description: str


class SearchingResponse(BaseModel):
    algorithm: str
    steps: list[SearchingStep]
    found: bool
    found_at: Optional[int] = None


class GraphNode(BaseModel):
    id: str
    x: float
    y: float
    label: Optional[str] = None


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: Optional[float] = 1


class GraphRequest(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    start_node: Optional[str] = None
    end_node: Optional[str] = None


class GraphStep(BaseModel):
    visited: list[str]
    current: Optional[str] = None
    queue: Optional[list[str]] = None     # For BFS
    stack: Optional[list[str]] = None     # For DFS
    distances: Optional[dict[str, float]] = None  # For Dijkstra
    path: Optional[list[str]] = None
    mst_edges: Optional[list[dict]] = None  # For Kruskal/Prim
    description: str


class GraphResponse(BaseModel):
    algorithm: str
    steps: list[GraphStep]
    result: Optional[list[str]] = None    # Final path/traversal order
    total_cost: Optional[float] = None


class TreeNode(BaseModel):
    value: int
    left: Optional['TreeNode'] = None
    right: Optional['TreeNode'] = None
    x: Optional[float] = None
    y: Optional[float] = None


class TreeRequest(BaseModel):
    tree: Optional[dict] = None
    values: Optional[list[int]] = None    # For building tree
    value: Optional[int] = None           # For insert/delete


class TreeStep(BaseModel):
    tree: dict
    current: Optional[int] = None         # Current node value
    visited: list[int] = []
    comparing: Optional[int] = None
    description: str


class TreeResponse(BaseModel):
    algorithm: str
    steps: list[TreeStep]
    result: Optional[list[int]] = None


class DPRequest(BaseModel):
    input_data: Any                        # Flexible input for different DP problems
    n: Optional[int] = None
    capacity: Optional[int] = None         # For knapsack


class DPStep(BaseModel):
    table: list[list[Any]]
    current_cell: Optional[tuple[int, int]] = None
    description: str


class DPResponse(BaseModel):
    algorithm: str
    steps: list[DPStep]
    result: Any
