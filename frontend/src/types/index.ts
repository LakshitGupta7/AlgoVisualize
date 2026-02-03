// Sorting Types
export interface SortingStep {
    array: number[];
    comparing?: number[];
    swapping?: number[];
    sorted: number[];
    pivot?: number;
    description: string;
}

export interface SortingResponse {
    algorithm: string;
    steps: SortingStep[];
    total_comparisons: number;
    total_swaps: number;
}

// Searching Types
export interface SearchingStep {
    array: number[];
    current?: number;
    left?: number;
    right?: number;
    mid?: number;
    found?: boolean;
    description: string;
}

export interface SearchingResponse {
    algorithm: string;
    steps: SearchingStep[];
    found: boolean;
    found_at?: number;
}

// Graph Types
export interface GraphNode {
    id: string;
    x: number;
    y: number;
    label?: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
}

export interface GraphStep {
    visited: string[];
    current?: string;
    queue?: string[];
    stack?: string[];
    distances?: Record<string, number>;
    path?: string[];
    mst_edges?: { source: string; target: string; weight: number }[];
    description: string;
}

export interface GraphResponse {
    algorithm: string;
    steps: GraphStep[];
    result?: string[];
    total_cost?: number;
}

// Tree Types
export interface TreeNode {
    value: number;
    left?: TreeNode;
    right?: TreeNode;
    x?: number;
    y?: number;
}

export interface TreeStep {
    tree: Record<string, unknown>;
    current?: number;
    visited: number[];
    comparing?: number;
    description: string;
}

export interface TreeResponse {
    algorithm: string;
    steps: TreeStep[];
    result?: number[];
}

// DP Types
export interface DPStep {
    table: (string | number)[][];
    current_cell?: [number, number];
    description: string;
}

export interface DPResponse {
    algorithm: string;
    steps: DPStep[];
    result: string | number;
}

// Visualization State
export interface VisualizationState {
    isPlaying: boolean;
    currentStep: number;
    speed: number;
    steps: SortingStep[] | SearchingStep[] | GraphStep[] | TreeStep[] | DPStep[];
}

// Algorithm Info
export interface AlgorithmInfo {
    name: string;
    category: string;
    complexity_time: string;
    complexity_space: string;
    description?: string;
}
