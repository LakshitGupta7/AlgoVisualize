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

const GraphPage: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [nextNodeId, setNextNodeId] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
    const [mode, setMode] = useState<'node' | 'edge' | 'select-start' | 'select-target' | 'set-weight'>('node');
    const [isDirected, setIsDirected] = useState(false);
    const [startNodeId, setStartNodeId] = useState<number | null>(null);
    const [targetNodeId, setTargetNodeId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<GraphCategory>('basic');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [stopRequested, setStopRequested] = useState(false);
    const [message, setMessage] = useState('Click on the canvas to add nodes');
    const [speed, setSpeed] = useState(800);
    const [showCodePanel, setShowCodePanel] = useState(false);
    const [currentLine, setCurrentLine] = useState<number | null>(null);
    const [activeAlgo, setActiveAlgo] = useState<'bfs' | 'dfs' | 'dijkstra' | null>(null);
    const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
    const [tempWeight, setTempWeight] = useState<string>('');
    const [pathCost, setPathCost] = useState<number | null>(null);

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

    const canvasRef = useRef<SVGSVGElement>(null);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (mode !== 'node' || isAnimating) return;

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

        if (mode === 'edge') {
            if (selectedNodes.includes(id)) {
                setSelectedNodes(prev => prev.filter(nid => nid !== id));
            } else if (selectedNodes.length < 2) {
                const newSelected = [...selectedNodes, id];
                setSelectedNodes(newSelected);

                if (newSelected.length === 2) {
                    const [from, to] = newSelected;
                    // Check if edge already exists in same direction (if directed) or either (if undirected)
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
        if (isAnimating || activeCategory !== 'shortest-path' || mode !== 'set-weight') return;

        const edge = edges.find(e => e.id === id);
        if (edge) {
            setEditingEdgeId(id);
            setTempWeight(String(edge.weight || 1));
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
                while (curr !== startNodeId && curr !== null) {
                    const prevNode = previous[curr];
                    if (prevNode === null) break;
                    const edge = edges.find(e =>
                        (e.from === prevNode && e.to === curr) ||
                        (!isDirected && e.from === curr && e.to === prevNode)
                    );
                    if (edge) pathEdges.push(edge.id);
                    curr = prevNode;
                }

                setEdges(prev => prev.map(e => pathEdges.includes(e.id) ? { ...e, isActive: true } : e));
                setPathCost(distances[targetNodeId]);
                showMessage(`Shortest distance: ${distances[targetNodeId]}`);
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
                    showMessage(`Target node ${nodes.find(n => n.id === currentId)?.label} found!`);
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
            if (!found && !stopRequestedRef.current) showMessage('DFS Traversal Complete');
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
                        <h2>Visualization Canvas</h2>
                        <div className="canvas-hint">{message}</div>
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
                                            className={`graph-edge ${edge.isActive ? 'active' : ''} ${edge.isDirected ? 'directed' : ''}`}
                                            markerEnd={edge.isDirected ? `url(#arrowhead${edge.isActive ? '-active' : ''})` : ''}
                                            onClick={(e) => handleEdgeClick(edge.id, e)}
                                        />
                                        {edge.weight !== undefined && (
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
                                    Nodes
                                </button>
                                <button
                                    className={`mode-btn ${mode === 'edge' ? 'active' : ''}`}
                                    onClick={() => setMode('edge')}
                                    disabled={isAnimating}
                                >
                                    <span className="btn-icon">➖</span>
                                    Edges
                                </button>
                                {activeCategory === 'shortest-path' && (
                                    <button
                                        className={`mode-btn ${mode === 'set-weight' ? 'active' : ''}`}
                                        onClick={() => setMode('set-weight')}
                                        disabled={isAnimating}
                                    >
                                        <span className="btn-icon">⚖️</span>
                                        Weight
                                    </button>
                                )}
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
                                        <button
                                            className="op-btn BFS"
                                            onClick={runDijkstra}
                                            disabled={nodes.length === 0}
                                            style={{ gridColumn: 'span 2' }}
                                        >
                                            <span className="op-icon">🏁</span>
                                            Dijkstra's
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

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

                        <div className="danger-zone">
                            <button className="op-btn clear-all" onClick={clearCanvas}>
                                <span className="op-icon">🗑️</span>
                                {isAnimating ? 'Stop & Clear' : 'Clear Canvas'}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="message-display animate-fadeIn">
                            {message}
                        </div>
                    )}
                </div>
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
                        {(activeAlgo ? ALGO_CODE[activeAlgo] : ALGO_CODE.bfs).map((line, index) => (
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
