import React, { useState, useCallback, useRef, useEffect } from 'react';
import './GraphPage.css';

interface Node {
    id: number;
    x: number;
    y: number;
    label: string;
    isVisited?: boolean;
    isActive?: boolean;
    isFrontier?: boolean;
    distance?: number | string;
}

interface Edge {
    id: string;
    from: number;
    to: number;
    weight?: number;
    isActive?: boolean;
    isDirected?: boolean;
}

type GraphCategory = 'basic' | 'shortest-path';

const ALGO_DETAILS = {
    dijkstra: {
        formula: "f(n) = g(n)",
        formulaDesc: "Greedy search focusing on total path cost.",
        logic: [
            "g(n): Actual cost from start to node n.",
            "Expands the node with the smallest total distance."
        ]
    },
    'bellman-ford': {
        formula: "dist[v] \u2264 dist[u] + w",
        formulaDesc: "Iterative relaxation of all edges.",
        logic: [
            "Handles negative weights.",
            "Checks every path systematically (|V|-1 times)."
        ]
    },
    astar: {
        formula: "f(n) = g(n) + h(n)",
        formulaDesc: "Heuristic search using estimates to guide the path.",
        logic: [
            "g(n): Actual cost from start to node n.",
            "h(n): Estimated cost (Euclidean) from n to target.",
            "Total cost f(n) decides the priority."
        ]
    }
};

const GraphPage: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [nextNodeId, setNextNodeId] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
    const [mode, setMode] = useState<'node' | 'select-start' | 'select-target'>('node');
    const [isDirected, setIsDirected] = useState(false);
    const [startNodeId, setStartNodeId] = useState<number | null>(null);
    const [targetNodeId, setTargetNodeId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<GraphCategory>('basic');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [stopRequested, setStopRequested] = useState(false);
    const [message, setMessage] = useState('Click canvas to add nodes, click two nodes to connect them');
    const [speed, setSpeed] = useState(800);
    const [showCodePanel, setShowCodePanel] = useState(false);
    const [currentLine, setCurrentLine] = useState<number | null>(null);
    const [activeAlgo, setActiveAlgo] = useState<'bfs' | 'dfs' | 'dijkstra' | 'bellman-ford' | 'astar' | null>(null);
    const [shortestPathAlgo, setShortestPathAlgo] = useState<'dijkstra' | 'bellman-ford' | 'astar'>('dijkstra');
    const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
    const [tempWeight, setTempWeight] = useState<string>('');
    const [pathCost, setPathCost] = useState<number | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

    const ALGO_CODE = {
        bfs: [
            "void bfs(Node start, Node target) {",
            "  Queue q = [start];",
            "  visited = {start};",
            "",
            "  while (!q.isEmpty()) {",
            "    Node curr = q.dequeue();",
            "    if (curr == target) return;",
            "",
            "    for (Node neighbor : adj[curr]) {",
            "      if (neighbor not in visited) {",
            "        visited.add(neighbor);",
            "        q.enqueue(neighbor);",
            "      }",
            "    }",
            "  }",
            "}"
        ],
        dfs: [
            "void dfs(Node curr, Node target) {",
            "  visited.add(curr);",
            "  if (curr == target) return true;",
            "",
            "  for (Node neighbor : adj[curr]) {",
            "    if (neighbor not in visited) {",
            "      if (dfs(neighbor, target))",
            "        return true;",
            "    }",
            "  }",
            "  return false;",
            "}"
        ],
        dijkstra: [
            "void dijkstra(Node start) {",
            "  dist[all] = ∞; dist[start] = 0;",
            "  PQ.push({0, start});",
            "",
            "  while (!PQ.isEmpty()) {",
            "    {d, curr} = PQ.pop();",
            "    if (d > dist[curr]) continue;",
            "",
            "    for (Edge e : adj[curr]) {",
            "      if (dist[curr] + e.weight < dist[e.to]) {",
            "        dist[e.to] = dist[curr] + e.weight;",
            "        PQ.push({dist[e.to], e.to});",
            "      }",
            "    }",
            "  }",
            "}"
        ],
        'bellman-ford': [
            "void bellmanFord(Node start) {",
            "  dist[all] = ∞; dist[start] = 0;",
            "",
            "  for (int i = 0; i < V - 1; i++) {",
            "    for (Edge e : allEdges) {",
            "      if (dist[e.from] + e.weight < dist[e.to]) {",
            "        dist[e.to] = dist[e.from] + e.weight;",
            "      }",
            "    }",
            "  }",
            "",
            "  // Check for negative cycles",
            "  for (Edge e : allEdges) {",
            "    if (dist[e.from] + e.weight < dist[e.to])",
            "      error 'Negative cycle found';",
            "  }",
            "}"
        ],
        astar: [
            "void astar(Node start, Node target) {",
            "  dist[all] = ∞; dist[start] = 0;",
            "  PQ.push({h(start), start});",
            "",
            "  while (!PQ.isEmpty()) {",
            "    {f, curr} = PQ.pop();",
            "    if (curr == target) return;",
            "",
            "    for (Edge e : adj[curr]) {",
            "      g = dist[curr] + e.weight;",
            "      if (g < dist[e.to]) {",
            "        dist[e.to] = g;",
            "        f = g + h(e.to, target);",
            "        PQ.push({f, e.to});",
            "      }",
            "    }",
            "  }",
            "}"
        ]
    };

    const isPausedRef = useRef(false);
    const stopRequestedRef = useRef(false);
    const speedRef = useRef(speed);

    // Sync refs with state for use in async loops
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        stopRequestedRef.current = stopRequested;
    }, [stopRequested]);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        if (activeCategory === 'shortest-path') {
            setEdges(prev => prev.map(edge => ({
                ...edge,
                weight: edge.weight ?? (Math.floor(Math.random() * 9) + 1)
            })));
        }
    }, [activeCategory]);

    const canvasRef = useRef<SVGSVGElement>(null);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (mode !== 'node' || isAnimating) return;
        setSelectedEdgeId(null);

        const svg = canvasRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if too close to another node
        const tooClose = nodes.some(n => Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < 60);
        if (tooClose) return;

        const newNode: Node = {
            id: nextNodeId,
            x,
            y,
            label: String.fromCharCode(65 + (nextNodeId % 26)) + (nextNodeId >= 26 ? Math.floor(nextNodeId / 26) : '')
        };

        setNodes(prev => [...prev, newNode]);
        setNextNodeId(prev => prev + 1);
    };

    const handleNodeClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) return;
        setSelectedEdgeId(null);

        if (mode === 'node') {
            if (selectedNodes.includes(id)) {
                setSelectedNodes(prev => prev.filter(nid => nid !== id));
            } else if (selectedNodes.length < 2) {
                const newSelected = [...selectedNodes, id];
                setSelectedNodes(newSelected);

                if (newSelected.length === 2) {
                    const [from, to] = newSelected;
                    // Check if edge already exists
                    const exists = edges.some(e =>
                        (e.from === from && e.to === to) || (!isDirected && e.from === to && e.to === from)
                    );

                    if (!exists && from !== to) {
                        const newEdge: Edge = {
                            id: `${from}-${to}-${Date.now()}`,
                            from,
                            to,
                            isDirected,
                            weight: activeCategory === 'shortest-path' ? Math.floor(Math.random() * 9) + 1 : undefined
                        };
                        setEdges(prev => [...prev, newEdge]);
                    }
                    setSelectedNodes([]);
                }
            }
        } else if (mode === 'select-start') {
            setStartNodeId(id);
            setMode('node');
            showMessage(`Start node set to ${nodes.find(n => n.id === id)?.label}`);
        } else if (mode === 'select-target') {
            setTargetNodeId(id);
            setMode('node');
            showMessage(`Target node set to ${nodes.find(n => n.id === id)?.label}`);
        }
    };

    const handleEdgeClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) return;

        setSelectedEdgeId(prev => prev === id ? null : id);

        if (activeCategory === 'shortest-path') {
            const edge = edges.find(e => e.id === id);
            if (edge) {
                setEditingEdgeId(id);
                setTempWeight(String(edge.weight || 1));
            }
        }
    };

    const saveWeight = () => {
        if (editingEdgeId) {
            const w = parseInt(tempWeight);
            if (!isNaN(w) && w > 0) {
                setEdges(prev => prev.map(e => e.id === editingEdgeId ? { ...e, weight: w } : e));
            }
            setEditingEdgeId(null);
        }
    };

    const clearCanvas = () => {
        if (isAnimating) {
            setStopRequested(true);
            return;
        }

        if (selectedEdgeId) {
            setEdges(prev => prev.filter(e => e.id !== selectedEdgeId));
            setSelectedEdgeId(null);
            return;
        }

        setNodes([]);
        setEdges([]);
        setNextNodeId(0);
        setSelectedNodes([]);
        setStartNodeId(null);
        setTargetNodeId(null);
        setIsAnimating(false);
        setIsPaused(false);
        setStopRequested(false);
        setPathCost(null);
    };

    const resetColors = useCallback(() => {
        setNodes(prev => prev.map(n => ({ ...n, isVisited: false, isActive: false, isFrontier: false, distance: undefined })));
        setEdges(prev => prev.map(e => ({ ...e, isActive: false })));
        setPathCost(null);
    }, []);

    const getNeighbors = (nodeId: number) => {
        if (isDirected) {
            return edges.filter(e => e.from === nodeId).map(e => e.to);
        } else {
            return edges.filter(e => e.from === nodeId || e.to === nodeId)
                .map(e => e.from === nodeId ? e.to : e.from);
        }
    };

    const getHeuristic = useCallback((nodeId: number) => {
        const node = nodes.find(n => n.id === nodeId);
        const targetNode = nodes.find(n => n.id === targetNodeId);
        if (!node || !targetNode) return 0;
        const dist = Math.sqrt(Math.pow(node.x - targetNode.x, 2) + Math.pow(node.y - targetNode.y, 2));
        return Math.floor(dist / 50); // Normalize heuristic
    }, [nodes, targetNodeId]);

    const sleep = async (ms?: number) => {
        const duration = ms !== undefined ? ms : speedRef.current;
        const start = Date.now();
        while (Date.now() - start < duration) {
            if (stopRequestedRef.current) throw new Error('STOP');
            if (isPausedRef.current) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    };

    const highlight = async (line: number, ms?: number) => {
        setCurrentLine(line);
        await sleep(ms);
    };

    const runDijkstra = async () => {
        if (nodes.length === 0 || isAnimating || startNodeId === null || targetNodeId === null) {
            showMessage('Select Start and Target nodes first!');
            return;
        }

        setIsAnimating(true);
        setIsPaused(false);
        setStopRequested(false);
        resetColors();
        setActiveAlgo('dijkstra');

        const distances: Record<number, number> = {};
        const previous: Record<number, number | null> = {};
        const unvisited = new Set<number>();

        nodes.forEach(node => {
            distances[node.id] = Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });

        distances[startNodeId] = 0;

        // Initialize distances visually
        setNodes(prev => prev.map(n => ({
            ...n,
            distance: n.id === startNodeId ? 0 : '∞'
        })));

        try {
            await highlight(1); // dist[all] = inf; dist[start] = 0
            await highlight(2); // PQ.push({0, start})

            while (unvisited.size > 0) {
                // Find node with minimum distance
                let currentId: number | null = null;
                let minDistance = Infinity;

                unvisited.forEach(id => {
                    if (distances[id] < minDistance) {
                        minDistance = distances[id];
                        currentId = id;
                    }
                });

                if (currentId === null || minDistance === Infinity) break;
                const currentIdLocked = currentId as number;
                await highlight(5); // {d, curr} = PQ.pop()

                unvisited.delete(currentIdLocked);
                setNodes(prev => prev.map(n => n.id === currentIdLocked ? { ...n, isActive: true } : n));
                await highlight(6);

                if (currentIdLocked === targetNodeId) break;

                const neighborhood = getNeighbors(currentIdLocked);
                await highlight(8); // for (Edge e : adj[curr])

                for (const neighborId of neighborhood) {
                    const edge = edges.find(e =>
                        (e.from === currentIdLocked && e.to === neighborId) ||
                        (!isDirected && e.from === neighborId && e.to === currentIdLocked)
                    );

                    if (edge) {
                        setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: true } : e));
                    }

                    const weight = edge?.weight || 1;
                    const alt = distances[currentIdLocked] + weight;

                    await highlight(9); // if (dist[curr] + e.weight < dist[e.to])
                    if (alt < distances[neighborId]) {
                        distances[neighborId] = alt;
                        previous[neighborId] = currentIdLocked;
                        setNodes(prev => prev.map(n => n.id === neighborId ? { ...n, distance: alt, isFrontier: true } : n));
                        await highlight(10);
                        await highlight(11);
                        setNodes(prev => prev.map(n => n.id === neighborId ? { ...n, isFrontier: false } : n));
                    }

                    if (edge) {
                        setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: false } : e));
                    }
                }

                setNodes(prev => prev.map(n => n.id === currentIdLocked ? { ...n, isActive: false, isVisited: true } : n));
            }

            // Trace path
            if (previous[targetNodeId] !== null || targetNodeId === startNodeId) {
                let curr = targetNodeId;
                const pathEdges: string[] = [];
                const pathNodeIds: number[] = [targetNodeId];
                while (curr !== startNodeId && curr !== null) {
                    const prevNode = previous[curr];
                    if (prevNode === null) break;
                    const edge = edges.find(e =>
                        (e.from === prevNode && e.to === curr) ||
                        (!isDirected && e.from === curr && e.to === prevNode)
                    );
                    if (edge) pathEdges.push(edge.id);
                    pathNodeIds.push(prevNode);
                    curr = prevNode;
                }

                setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                setNodes(prev => prev.map(n => ({
                    ...n,
                    isVisited: pathNodeIds.includes(n.id)
                })));
                setPathCost(distances[targetNodeId]);
                showMessage(`${shortestPathAlgo.toUpperCase()} Complete!`);
            } else {
                showMessage('No path found');
            }

        } catch (e: any) {
            if (e.message === 'STOP') showMessage('Traversal Stopped');
        } finally {
            setIsAnimating(false);
            setIsPaused(false);
            setStopRequested(false);
            setCurrentLine(null);
        }
    };

    const runBellmanFord = async () => {
        if (nodes.length === 0 || isAnimating || startNodeId === null || targetNodeId === null) {
            showMessage('Select Start and Target nodes first!');
            return;
        }

        setIsAnimating(true);
        setIsPaused(false);
        setStopRequested(false);
        resetColors();
        setActiveAlgo('bellman-ford');

        const distances: Record<number, number> = {};
        const previous: Record<number, number | null> = {};

        nodes.forEach(node => {
            distances[node.id] = Infinity;
            previous[node.id] = null;
        });

        distances[startNodeId] = 0;
        setNodes(prev => prev.map(n => ({
            ...n,
            distance: n.id === startNodeId ? 0 : '∞'
        })));

        try {
            await highlight(1); // dist[all] = inf; dist[start] = 0

            for (let i = 0; i < nodes.length - 1; i++) {
                await highlight(3); // for (int i = 0; i < V - 1; i++)
                let changed = false;

                for (const edge of edges) {
                    if (stopRequestedRef.current) break;
                    await highlight(4); // for (Edge e : allEdges)

                    // Visualize edge check
                    setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: true } : e));
                    setNodes(prev => prev.map(n => n.id === edge.from ? { ...n, isActive: true } : n));

                    const weight = edge.weight || 1;
                    const u = edge.from;
                    const v = edge.to;

                    await highlight(5); // if (dist[e.from] + e.weight < dist[e.to])
                    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                        distances[v] = distances[u] + weight;
                        previous[v] = u;
                        changed = true;
                        setNodes(prev => prev.map(n => n.id === v ? { ...n, distance: distances[v], isFrontier: true } : n));
                        await highlight(6); // dist[e.to] = dist[e.from] + e.weight
                        setNodes(prev => prev.map(n => n.id === v ? { ...n, isFrontier: false } : n));
                    }

                    // For Undirected graphs, relax both directions
                    if (!isDirected && distances[v] !== Infinity && distances[v] + weight < distances[u]) {
                        distances[u] = distances[v] + weight;
                        previous[u] = v;
                        changed = true;
                        setNodes(prev => prev.map(n => n.id === u ? { ...n, distance: distances[u], isFrontier: true } : n));
                        await highlight(6);
                        setNodes(prev => prev.map(n => n.id === u ? { ...n, isFrontier: false } : n));
                    }

                    setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: false } : e));
                    setNodes(prev => prev.map(n => n.id === edge.from ? { ...n, isActive: false, isVisited: true } : n));
                }

                if (!changed) break;
            }

            // Path Trace
            if (previous[targetNodeId] !== null || targetNodeId === startNodeId) {
                let curr = targetNodeId;
                const pathEdges: string[] = [];
                const pathNodeIds: number[] = [targetNodeId];
                while (curr !== startNodeId && curr !== null) {
                    const prevNode = previous[curr];
                    if (prevNode === null) break;
                    const edge = edges.find(e =>
                        (e.from === prevNode && e.to === curr) || (!isDirected && e.from === curr && e.to === prevNode)
                    );
                    if (edge) pathEdges.push(edge.id);
                    pathNodeIds.push(prevNode);
                    curr = prevNode;
                }
                setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                setNodes(prev => prev.map(n => ({ ...n, isVisited: pathNodeIds.includes(n.id) })));
                setPathCost(distances[targetNodeId]);
                showMessage(`Bellman-Ford Complete!`);
            } else {
                showMessage('No path found');
            }

        } catch (e: any) {
            if (e.message === 'STOP') showMessage('Traversal Stopped');
        } finally {
            setIsAnimating(false);
            setIsPaused(false);
            setStopRequested(false);
            setCurrentLine(null);
        }
    };

    const runAStar = async () => {
        if (nodes.length === 0 || isAnimating || startNodeId === null || targetNodeId === null) {
            showMessage('Select Start and Target nodes first!');
            return;
        }

        setIsAnimating(true);
        setIsPaused(false);
        setStopRequested(false);
        resetColors();
        setActiveAlgo('astar');

        const distances: Record<number, number> = {};
        const fScores: Record<number, number> = {};
        const previous: Record<number, number | null> = {};
        const unvisited = new Set<number>();

        nodes.forEach(node => {
            distances[node.id] = Infinity;
            fScores[node.id] = Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });

        distances[startNodeId] = 0;
        fScores[startNodeId] = getHeuristic(startNodeId);

        setNodes(prev => prev.map(n => ({
            ...n,
            distance: n.id === startNodeId ? `0+${getHeuristic(n.id)}` : '∞'
        })));

        try {
            await highlight(1); // dist[all] = inf; dist[start] = 0
            await highlight(2); // PQ.push({h(start), start})

            while (unvisited.size > 0) {
                let currentId: number | null = null;
                let minF = Infinity;

                unvisited.forEach(id => {
                    if (fScores[id] < minF) {
                        minF = fScores[id];
                        currentId = id;
                    }
                });

                if (currentId === null || minF === Infinity) break;
                const currentIdLocked = currentId as number;
                await highlight(5); // {f, curr} = PQ.pop()

                unvisited.delete(currentIdLocked);
                setNodes(prev => prev.map(n => n.id === currentIdLocked ? { ...n, isActive: true } : n));
                await highlight(6); // if (curr == target) return

                if (currentIdLocked === targetNodeId) break;

                const neighborhood = getNeighbors(currentIdLocked);
                await highlight(8); // for (Edge e : adj[curr])

                for (const neighborId of neighborhood) {
                    const edge = edges.find(e =>
                        (e.from === currentIdLocked && e.to === neighborId) ||
                        (!isDirected && e.from === neighborId && e.to === currentIdLocked)
                    );

                    if (edge) setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: true } : e));

                    const weight = edge?.weight || 1;
                    const gScore = distances[currentIdLocked] + weight;

                    await highlight(9); // g = dist[curr] + weight
                    await highlight(10); // if (g < dist[e.to])
                    if (gScore < distances[neighborId]) {
                        distances[neighborId] = gScore;
                        const h = getHeuristic(neighborId);
                        fScores[neighborId] = gScore + h;
                        previous[neighborId] = currentIdLocked;

                        setNodes(prev => prev.map(n => n.id === neighborId ? {
                            ...n,
                            distance: `${gScore}+${h}`,
                            isFrontier: true
                        } : n));

                        await highlight(11); // dist[e.to] = g
                        await highlight(12); // f = g + h
                        await highlight(13); // PQ.push({f, e.to})
                        setNodes(prev => prev.map(n => n.id === neighborId ? { ...n, isFrontier: false } : n));
                    }

                    if (edge) setEdges(prev => prev.map(e => e.id === edge.id ? { ...e, isActive: false } : e));
                }

                setNodes(prev => prev.map(n => n.id === currentIdLocked ? { ...n, isActive: false, isVisited: true } : n));
            }

            // Path Trace
            if (previous[targetNodeId] !== null || targetNodeId === startNodeId) {
                let curr = targetNodeId;
                const pathEdges: string[] = [];
                const pathNodeIds: number[] = [targetNodeId];
                while (curr !== startNodeId && curr !== null) {
                    const prevNode = previous[curr];
                    if (prevNode === null) break;
                    const edge = edges.find(e =>
                        (e.from === prevNode && e.to === curr) || (!isDirected && e.from === curr && e.to === prevNode)
                    );
                    if (edge) pathEdges.push(edge.id);
                    pathNodeIds.push(prevNode);
                    curr = prevNode;
                }
                setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                setNodes(prev => prev.map(n => ({ ...n, isVisited: pathNodeIds.includes(n.id) })));
                setPathCost(distances[targetNodeId]);
                showMessage(`A* Search Complete!`);
            } else {
                showMessage('No path found');
            }

        } catch (e: any) {
            if (e.message === 'STOP') showMessage('Traversal Stopped');
        } finally {
            setIsAnimating(false);
            setIsPaused(false);
            setStopRequested(false);
            setCurrentLine(null);
        }
    };

    const runShortestPath = () => {
        if (shortestPathAlgo === 'dijkstra') runDijkstra();
        else if (shortestPathAlgo === 'bellman-ford') runBellmanFord();
        else if (shortestPathAlgo === 'astar') runAStar();
    };

    const runBFS = async () => {
        if (nodes.length === 0 || isAnimating) return;
        const startId = startNodeId !== null ? startNodeId : nodes[0].id;

        setIsAnimating(true);
        setIsPaused(false);
        setStopRequested(false);
        resetColors();
        setActiveAlgo('bfs');

        const queue: number[] = [startId];
        const visited = new Set<number>([startId]);
        const previous: Record<number, number | null> = {};
        nodes.forEach(n => previous[n.id] = null);

        try {
            await highlight(1); // queue q = [start]
            await highlight(2); // visited = {start}

            setNodes(prev => prev.map(n => n.id === startId ? { ...n, isFrontier: true } : n));
            await highlight(4); // while (!q.isEmpty())

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                await highlight(5); // Node curr = q.dequeue()

                setNodes(prev => prev.map(n =>
                    n.id === currentId ? { ...n, isActive: true, isFrontier: false } : n
                ));
                await highlight(6); // if (curr == target) return;

                if (currentId === targetNodeId) {
                    showMessage(`Target node found! Tracing path...`);
                    // Trace path
                    let curr = targetNodeId;
                    const pathEdges: string[] = [];
                    const pathNodeIds: number[] = [targetNodeId];
                    while (curr !== startId && curr !== null) {
                        const prevNode = previous[curr];
                        if (prevNode === null) break;
                        const edge = edges.find(e =>
                            (e.from === prevNode && e.to === curr) ||
                            (!isDirected && e.from === curr && e.to === prevNode)
                        );
                        if (edge) pathEdges.push(edge.id);
                        pathNodeIds.push(prevNode);
                        curr = prevNode;
                    }
                    setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                    setNodes(prev => prev.map(n => ({
                        ...n,
                        isVisited: pathNodeIds.includes(n.id)
                    })));
                    setIsAnimating(false);
                    return;
                }

                const neighbors = getNeighbors(currentId);
                await highlight(8); // for (Node neighbor : adj[curr])

                for (const neighborId of neighbors) {
                    await highlight(9); // if (neighbor not in visited)
                    if (!visited.has(neighborId)) {
                        visited.add(neighborId);
                        await highlight(10); // visited.add(neighbor)

                        setEdges(prev => prev.map(e =>
                            (e.from === currentId && e.to === neighborId) || (!isDirected && e.from === neighborId && e.to === currentId)
                                ? { ...e, isActive: true } : e
                        ));

                        setNodes(prev => prev.map(n =>
                            n.id === neighborId ? { ...n, isFrontier: true } : n
                        ));

                        previous[neighborId] = currentId;
                        queue.push(neighborId);
                        await highlight(11); // q.enqueue(neighbor)
                    }
                }

                setNodes(prev => prev.map(n =>
                    n.id === currentId ? { ...n, isActive: false, isVisited: true } : n
                ));
                await highlight(4); // back to while
            }
            showMessage('BFS Traversal Complete');
            await highlight(0, 0); // clear highlight
        } catch (e: any) {
            if (e.message === 'STOP') showMessage('Traversal Stopped');
        } finally {
            setIsAnimating(false);
            setIsPaused(false);
            setStopRequested(false);
            setCurrentLine(null);
        }
    };

    const runDFS = async () => {
        if (nodes.length === 0 || isAnimating) return;
        const startId = startNodeId !== null ? startNodeId : nodes[0].id;
        let found = false;

        setIsAnimating(true);
        setIsPaused(false);
        setStopRequested(false);
        resetColors();
        setActiveAlgo('dfs');

        const visited = new Set<number>();
        const previous: Record<number, number | null> = {};
        nodes.forEach(n => previous[n.id] = null);

        const dfs = async (currentId: number) => {
            if (found || stopRequestedRef.current) return;

            visited.add(currentId);
            await highlight(1); // visited.add(curr)

            setNodes(prev => prev.map(n => n.id === currentId ? { ...n, isActive: true } : n));
            await highlight(2); // if (curr == target) return true

            if (currentId === targetNodeId) {
                showMessage(`Target node ${nodes.find(n => n.id === currentId)?.label} found!`);
                found = true;
                return;
            }

            const neighbors = getNeighbors(currentId);
            await highlight(4); // for (Node neighbor : adj[curr])

            for (const neighborId of neighbors) {
                await highlight(5); // if (neighbor not in visited)
                if (!visited.has(neighborId) && !found && !stopRequestedRef.current) {
                    setEdges(prev => prev.map(e =>
                        (e.from === currentId && e.to === neighborId) || (!isDirected && e.from === neighborId && e.to === currentId)
                            ? { ...e, isActive: true } : e
                    ));

                    previous[neighborId] = currentId;
                    await highlight(6); // if (dfs(neighbor, target))
                    await dfs(neighborId);

                    if (found || stopRequestedRef.current) return;

                    setNodes(prev => prev.map(n => n.id === currentId ? { ...n, isActive: true } : n));
                    await highlight(4); // back to for loop neighbor check
                }
            }

            setNodes(prev => prev.map(n =>
                n.id === currentId ? { ...n, isActive: false, isVisited: true } : n
            ));
            await highlight(10); // return false (end of function)
        };

        try {
            await dfs(startId);
            if (found) {
                // Trace path
                let curr = targetNodeId!;
                const pathEdges: string[] = [];
                const pathNodeIds: number[] = [targetNodeId!];
                while (curr !== startId && curr !== null) {
                    const prevNode = previous[curr];
                    if (prevNode === null) break;
                    const edge = edges.find(e =>
                        (e.from === prevNode && e.to === curr) ||
                        (!isDirected && e.from === curr && e.to === prevNode)
                    );
                    if (edge) pathEdges.push(edge.id);
                    pathNodeIds.push(prevNode);
                    curr = prevNode;
                }
                setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                setNodes(prev => prev.map(n => ({
                    ...n,
                    isVisited: pathNodeIds.includes(n.id)
                })));
            } else if (!stopRequestedRef.current) {
                showMessage('DFS Traversal Complete');
            }
            if (stopRequestedRef.current) showMessage('Traversal Stopped');
        } catch (e: any) {
            if (e.message === 'STOP') showMessage('Traversal Stopped');
        } finally {
            setIsAnimating(false);
            setIsPaused(false);
            setStopRequested(false);
            setCurrentLine(null);
        }
    };

    return (
        <div className="graph-page">
            <div className="ds-header">
                <h1 className="ds-title">
                    <span className="ds-icon">🔗</span>
                    Graph Algorithms
                </h1>
                <p className="ds-subtitle">Interactive visualization of graph traversals and structures</p>
            </div>

            <div className="graph-layout">
                <div className="graph-visualizer-panel">
                    <div className="panel-header">
                        <div className="header-left">
                            <h2>Visualization Canvas</h2>
                        </div>
                        <div className="header-right">
                            <div className="canvas-hint">{message}</div>
                            <button className="icon-btn clear-btn" onClick={clearCanvas} title="Clear Canvas">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="canvas-container">
                        <svg
                            ref={canvasRef}
                            className={`graph-svg ${mode}-mode`}
                            onClick={handleCanvasClick}
                        >
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="25"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
                                </marker>
                                <marker
                                    id="arrowhead-active"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="25"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-success)" />
                                </marker>
                            </defs>

                            {/* Edges */}
                            {edges.map(edge => {
                                const fromNode = nodes.find(n => n.id === edge.from);
                                const toNode = nodes.find(n => n.id === edge.to);
                                if (!fromNode || !toNode) return null;

                                const midX = (fromNode.x + toNode.x) / 2;
                                const midY = (fromNode.y + toNode.y) / 2;

                                return (
                                    <g key={edge.id}>
                                        <line
                                            x1={fromNode.x}
                                            y1={fromNode.y}
                                            x2={toNode.x}
                                            y2={toNode.y}
                                            className={`graph-edge ${edge.isActive ? 'active' : ''} ${edge.isDirected ? 'directed' : ''} ${selectedEdgeId === edge.id ? 'selected-for-delete' : ''}`}
                                            markerEnd={edge.isDirected ? `url(#arrowhead${edge.isActive ? '-active' : ''})` : ''}
                                            onClick={(e) => handleEdgeClick(edge.id, e)}
                                        />
                                        {activeCategory === 'shortest-path' && edge.weight !== undefined && (
                                            <g className="edge-weight-group" onClick={(e) => handleEdgeClick(edge.id, e)}>
                                                <rect x={midX - 12} y={midY - 12} width="24" height="24" rx="4" className="weight-bg" />
                                                <text x={midX} y={midY} dy=".35em" textAnchor="middle" className="weight-text">
                                                    {edge.weight}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Nodes */}
                            {nodes.map(node => (
                                <g
                                    key={node.id}
                                    className={`graph-node-group ${node.isActive ? 'active' : ''} ${node.isVisited ? 'visited' : ''} ${node.isFrontier ? 'frontier' : ''} ${selectedNodes.includes(node.id) ? 'selected' : ''} ${startNodeId === node.id ? 'start' : ''} ${targetNodeId === node.id ? 'target' : ''}`}
                                    transform={`translate(${node.x}, ${node.y})`}
                                    onClick={(e) => handleNodeClick(node.id, e)}
                                >
                                    <circle r="25" className="node-circle" />
                                    <text dy=".3em" textAnchor="middle" className="node-label">
                                        {node.label}
                                    </text>
                                    {node.distance !== undefined && (
                                        <text dy="-35" textAnchor="middle" className="dist-label">
                                            {node.distance}
                                        </text>
                                    )}
                                    {activeCategory === 'shortest-path' && shortestPathAlgo === 'astar' && targetNodeId !== null && (
                                        <text dy="38" textAnchor="middle" className="heuristic-label">
                                            h={getHeuristic(node.id)}
                                        </text>
                                    )}
                                    {startNodeId === node.id && <text dy={node.distance !== undefined ? "-50" : "-35"} textAnchor="middle" className="node-indicator">START</text>}
                                    {targetNodeId === node.id && <text dy="45" textAnchor="middle" className="node-indicator">TARGET</text>}
                                </g>
                            ))}

                            {/* Final Path Cost Display */}
                            {pathCost !== null && (
                                <g className="final-cost-badge" transform="translate(20, 20)">
                                    <rect width="180" height="40" rx="8" className="cost-badge-bg" />
                                    <text x="15" y="25" className="cost-badge-label">TOTAL PATH COST:</text>
                                    <text x="145" y="27" className="cost-badge-value">{pathCost}</text>
                                </g>
                            )}
                        </svg>
                    </div>
                </div>

                <div className="graph-controls-panel">
                    <div className="category-tabs">
                        <button
                            className={`cat-tab ${activeCategory === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('basic')}
                            disabled={isAnimating}
                        >
                            Basic Graph
                        </button>
                        <button
                            className={`cat-tab ${activeCategory === 'shortest-path' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('shortest-path')}
                            disabled={isAnimating}
                        >
                            Shortest Path Algos
                        </button>
                    </div>

                    <div className="panel-header">
                        <h2>Operations</h2>
                    </div>

                    <div className="controls-content">
                        <div className="interaction-mode">
                            <label>Interaction Mode</label>
                            <div className="mode-buttons">
                                <button
                                    className={`mode-btn ${mode === 'node' ? 'active' : ''}`}
                                    onClick={() => setMode('node')}
                                    disabled={isAnimating}
                                >
                                    <span className="btn-icon">⭕</span>
                                    Build
                                </button>
                            </div>
                        </div>

                        <div className="settings-section">
                            <label>Graph Type</label>
                            <div className="type-toggle">
                                <button
                                    className={`toggle-btn ${!isDirected ? 'active' : ''}`}
                                    onClick={() => {
                                        setIsDirected(false);
                                        setEdges(prev => prev.map(e => ({ ...e, isDirected: false })));
                                    }}
                                    disabled={isAnimating}
                                >
                                    Undirected
                                </button>
                                <button
                                    className={`toggle-btn ${isDirected ? 'active' : ''}`}
                                    onClick={() => {
                                        setIsDirected(true);
                                        setEdges(prev => prev.map(e => ({ ...e, isDirected: true })));
                                    }}
                                    disabled={isAnimating}
                                >
                                    Directed
                                </button>
                            </div>
                        </div>

                        <div className="node-selection">
                            <label>Traversal Settings</label>
                            <div className="select-buttons">
                                <button
                                    className={`mode-btn ${mode === 'select-start' ? 'active' : ''}`}
                                    onClick={() => setMode('select-start')}
                                    disabled={isAnimating || nodes.length === 0}
                                >
                                    {startNodeId !== null ? `From: ${nodes.find(n => n.id === startNodeId)?.label}` : 'Select Start'}
                                </button>
                                <button
                                    className={`mode-btn ${mode === 'select-target' ? 'active' : ''}`}
                                    onClick={() => setMode('select-target')}
                                    disabled={isAnimating || nodes.length === 0}
                                >
                                    {targetNodeId !== null ? `Find: ${nodes.find(n => n.id === targetNodeId)?.label}` : 'Select Target'}
                                </button>
                            </div>
                            {(startNodeId !== null || targetNodeId !== null) && (
                                <button className="clear-selection" onClick={() => { setStartNodeId(null); setTargetNodeId(null); }}>
                                    Reset Selection
                                </button>
                            )}
                        </div>

                        <div className="algorithm-selection">
                            <label>Run Algorithm</label>
                            {isAnimating ? (
                                <div className="animation-controls">
                                    <button
                                        className="op-btn pause-resume"
                                        onClick={() => setIsPaused(!isPaused)}
                                    >
                                        <span className="op-icon">{isPaused ? '▶️' : '⏸️'}</span>
                                        {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                                    <button
                                        className="op-btn stop"
                                        onClick={() => setStopRequested(true)}
                                    >
                                        <span className="op-icon">⏹️</span>
                                        Stop
                                    </button>
                                </div>
                            ) : (
                                <div className="algo-buttons">
                                    {activeCategory === 'basic' ? (
                                        <>
                                            <button
                                                className="op-btn BFS"
                                                onClick={runBFS}
                                                disabled={nodes.length === 0}
                                            >
                                                <span className="op-icon">🌊</span>
                                                BFS
                                            </button>
                                            <button
                                                className="op-btn DFS"
                                                onClick={runDFS}
                                                disabled={nodes.length === 0}
                                            >
                                                <span className="op-icon">🧗</span>
                                                DFS
                                            </button>
                                        </>
                                    ) : (
                                        <div className="algo-selector-carousel">
                                            <button
                                                className="carousel-arrow left"
                                                onClick={() => setShortestPathAlgo(prev =>
                                                    prev === 'dijkstra' ? 'astar' : prev === 'bellman-ford' ? 'dijkstra' : 'bellman-ford'
                                                )}
                                                disabled={isAnimating}
                                                title="Previous Algorithm"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                className="op-btn active-algo"
                                                onClick={runShortestPath}
                                                disabled={nodes.length === 0}
                                            >
                                                <span className="op-icon">
                                                    {shortestPathAlgo === 'dijkstra' ? '🏁' : shortestPathAlgo === 'bellman-ford' ? '📉' : '🎯'}
                                                </span>
                                                {shortestPathAlgo === 'dijkstra' ? 'Dijkstra' : shortestPathAlgo === 'bellman-ford' ? 'Bellman-Ford' : 'A* Search'}
                                            </button>
                                            <button
                                                className="carousel-arrow right"
                                                onClick={() => setShortestPathAlgo(prev =>
                                                    prev === 'dijkstra' ? 'bellman-ford' : prev === 'bellman-ford' ? 'astar' : 'dijkstra'
                                                )}
                                                disabled={isAnimating}
                                                title="Next Algorithm"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {activeCategory === 'shortest-path' && (
                            <div className="algo-info-card">
                                <div className="info-header">
                                    <span className="formula">{ALGO_DETAILS[shortestPathAlgo].formula}</span>
                                    <p className="formula-desc">{ALGO_DETAILS[shortestPathAlgo].formulaDesc}</p>
                                </div>
                                <div className="info-logic">
                                    {ALGO_DETAILS[shortestPathAlgo].logic.map((item, i) => (
                                        <div key={i} className="logic-item">
                                            <span className="bullet">{"\u2022"}</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="settings-section">
                            <div className="label-row">
                                <label>Speed: {speed}ms</label>
                                <button className="reset-vis" onClick={resetColors} disabled={isAnimating}>
                                    Reset Colors
                                </button>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="2000"
                                step="50"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="speed-slider"
                            />
                        </div>

                    </div>
                </div>

                {message && (
                    <div className="message-display animate-fadeIn">
                        {message}
                    </div>
                )}
            </div>

            {/* View Code Floating Button */}
            <button
                className={`view-code-floating ${showCodePanel ? 'active' : ''}`}
                onClick={() => setShowCodePanel(!showCodePanel)}
            >
                <span className="btn-icon">💻</span>
                {showCodePanel ? 'Hide Code' : 'View Code'}
            </button>

            {/* Code Overlay Panel */}
            <div className={`ds-code-overlay ${showCodePanel ? 'visible' : ''}`}>
                <div className="panel-header">
                    <h2>💻 {activeAlgo === 'dfs' ? 'DFS' : activeAlgo === 'dijkstra' ? 'Dijkstra' : 'BFS'} Implementation</h2>
                    <button className="close-btn" onClick={() => setShowCodePanel(false)}>✕</button>
                </div>
                <div className="code-container">
                    <pre className="code-block">
                        {(activeAlgo ? (ALGO_CODE[activeAlgo] as string[]) : ALGO_CODE.bfs).map((line: string, index: number) => (
                            <div
                                key={index}
                                className={`code-line ${currentLine === index ? 'highlighted' : ''}`}
                            >
                                <span className="line-number">{index + 1}</span>
                                <span className="line-content">{line || ' '}</span>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>

            {/* Weight Editor Modal */}
            {editingEdgeId && (
                <div className="weight-modal-overlay">
                    <div className="weight-modal">
                        <h3>⚖️ Update Weight</h3>
                        <p>
                            Edge: <strong>
                                {(() => {
                                    const edge = edges.find(e => e.id === editingEdgeId);
                                    if (!edge) return '';
                                    const from = nodes.find(n => n.id === edge.from)?.label;
                                    const to = nodes.find(n => n.id === edge.to)?.label;
                                    return `${from} - ${to}`;
                                })()}
                            </strong>
                        </p>
                        <input
                            type="number"
                            value={tempWeight}
                            onChange={(e) => setTempWeight(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveWeight()}
                            autoFocus
                            min="1"
                            max="99"
                        />
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={() => setEditingEdgeId(null)}>Cancel</button>
                            <button className="modal-btn save" onClick={saveWeight}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GraphPage;
