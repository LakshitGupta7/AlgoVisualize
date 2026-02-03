from fastapi import APIRouter
from models.schemas import GraphRequest, GraphResponse, GraphStep
import heapq
from collections import defaultdict

router = APIRouter()


def build_adjacency_list(nodes, edges, directed=False):
    adj = defaultdict(list)
    node_ids = {node.id for node in nodes}
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append((edge.target, edge.weight or 1))
            if not directed:
                adj[edge.target].append((edge.source, edge.weight or 1))
    return adj


def bfs_steps(nodes, edges, start_node: str):
    steps = []
    adj = build_adjacency_list(nodes, edges)
    visited = []
    queue = [start_node]
    result = []
    visited_set = {start_node}
    
    steps.append(GraphStep(visited=[], current=start_node, queue=queue.copy(),
        description=f"Starting BFS from node {start_node}"))
    
    while queue:
        current = queue.pop(0)
        result.append(current)
        visited.append(current)
        steps.append(GraphStep(visited=visited.copy(), current=current, queue=queue.copy(),
            description=f"Visiting node {current}"))
        
        for neighbor, _ in sorted(adj[current]):
            if neighbor not in visited_set:
                visited_set.add(neighbor)
                queue.append(neighbor)
    
    steps.append(GraphStep(visited=visited.copy(), path=result,
        description=f"BFS complete: {' → '.join(result)}"))
    return steps, result


def dfs_steps(nodes, edges, start_node: str):
    steps = []
    adj = build_adjacency_list(nodes, edges)
    visited = []
    stack = [start_node]
    result = []
    visited_set = set()
    
    steps.append(GraphStep(visited=[], current=start_node, stack=stack.copy(),
        description=f"Starting DFS from node {start_node}"))
    
    while stack:
        current = stack.pop()
        if current in visited_set:
            continue
        visited_set.add(current)
        result.append(current)
        visited.append(current)
        steps.append(GraphStep(visited=visited.copy(), current=current, stack=stack.copy(),
            description=f"Visiting node {current}"))
        
        for neighbor, _ in sorted(adj[current], reverse=True):
            if neighbor not in visited_set:
                stack.append(neighbor)
    
    steps.append(GraphStep(visited=visited.copy(), path=result,
        description=f"DFS complete: {' → '.join(result)}"))
    return steps, result


def dijkstra_steps(nodes, edges, start_node: str, end_node: str = None):
    steps = []
    adj = build_adjacency_list(nodes, edges)
    node_ids = [node.id for node in nodes]
    
    distances = {node: float('inf') for node in node_ids}
    distances[start_node] = 0
    previous = {node: None for node in node_ids}
    visited = []
    pq = [(0, start_node)]
    
    steps.append(GraphStep(visited=[], current=start_node, distances=distances.copy(),
        description=f"Starting Dijkstra from {start_node}"))
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        if current in visited:
            continue
        visited.append(current)
        steps.append(GraphStep(visited=visited.copy(), current=current, distances=distances.copy(),
            description=f"Processing {current} (dist: {current_dist})"))
        
        if current == end_node:
            break
        
        for neighbor, weight in adj[current]:
            if neighbor not in visited:
                new_dist = current_dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
    
    path = []
    total_cost = 0
    if end_node:
        current = end_node
        while current:
            path.append(current)
            current = previous[current]
        path.reverse()
        total_cost = distances[end_node]
    
    steps.append(GraphStep(visited=visited.copy(), distances=distances.copy(), path=path if path else None,
        description=f"Dijkstra complete" + (f": path cost {total_cost}" if end_node else "")))
    return steps, path, total_cost


def kruskal_steps(nodes, edges):
    steps = []
    node_ids = [node.id for node in nodes]
    parent = {node: node for node in node_ids}
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        parent[py] = px
        return True
    
    sorted_edges = sorted(edges, key=lambda e: e.weight or 1)
    mst_edges = []
    total_cost = 0
    
    steps.append(GraphStep(visited=[], mst_edges=[], description="Starting Kruskal's algorithm"))
    
    for edge in sorted_edges:
        if union(edge.source, edge.target):
            mst_edges.append({"source": edge.source, "target": edge.target, "weight": edge.weight or 1})
            total_cost += edge.weight or 1
            steps.append(GraphStep(visited=[edge.source, edge.target], mst_edges=mst_edges.copy(),
                description=f"Added edge {edge.source}→{edge.target}. Cost: {total_cost}"))
        if len(mst_edges) == len(nodes) - 1:
            break
    
    steps.append(GraphStep(visited=node_ids, mst_edges=mst_edges,
        description=f"MST complete! Total cost: {total_cost}"))
    return steps, mst_edges, total_cost


def prim_steps(nodes, edges, start_node: str = None):
    steps = []
    adj = build_adjacency_list(nodes, edges)
    node_ids = [node.id for node in nodes]
    if not start_node:
        start_node = node_ids[0]
    
    visited = set()
    mst_edges = []
    total_cost = 0
    pq = [(0, start_node, None)]
    
    steps.append(GraphStep(visited=[], mst_edges=[], description=f"Starting Prim's from {start_node}"))
    
    while pq and len(visited) < len(nodes):
        weight, current, parent = heapq.heappop(pq)
        if current in visited:
            continue
        visited.add(current)
        
        if parent:
            mst_edges.append({"source": parent, "target": current, "weight": weight})
            total_cost += weight
        
        steps.append(GraphStep(visited=list(visited), current=current, mst_edges=mst_edges.copy(),
            description=f"Added {parent}→{current}" if parent else f"Starting from {current}"))
        
        for neighbor, edge_weight in adj[current]:
            if neighbor not in visited:
                heapq.heappush(pq, (edge_weight, neighbor, current))
    
    steps.append(GraphStep(visited=list(visited), mst_edges=mst_edges,
        description=f"MST complete! Total cost: {total_cost}"))
    return steps, mst_edges, total_cost


@router.post("/{algorithm}", response_model=GraphResponse)
async def execute_graph_algorithm(algorithm: str, request: GraphRequest):
    start = request.start_node or (request.nodes[0].id if request.nodes else None)
    
    if algorithm == "bfs":
        steps, result = bfs_steps(request.nodes, request.edges, start)
        return GraphResponse(algorithm=algorithm, steps=steps, result=result)
    elif algorithm == "dfs":
        steps, result = dfs_steps(request.nodes, request.edges, start)
        return GraphResponse(algorithm=algorithm, steps=steps, result=result)
    elif algorithm == "dijkstra":
        steps, path, cost = dijkstra_steps(request.nodes, request.edges, start, request.end_node)
        return GraphResponse(algorithm=algorithm, steps=steps, result=path, total_cost=cost)
    elif algorithm == "kruskal":
        steps, _, cost = kruskal_steps(request.nodes, request.edges)
        return GraphResponse(algorithm=algorithm, steps=steps, total_cost=cost)
    elif algorithm == "prim":
        steps, _, cost = prim_steps(request.nodes, request.edges, start)
        return GraphResponse(algorithm=algorithm, steps=steps, total_cost=cost)
    return {"error": f"Unknown algorithm: {algorithm}"}


@router.get("/")
async def list_graph_algorithms():
    return {"algorithms": ["bfs", "dfs", "dijkstra", "kruskal", "prim"]}
