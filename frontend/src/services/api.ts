import { API_BASE_URL } from '../config';
import type { SortingResponse, SearchingResponse, GraphResponse, TreeResponse, DPResponse, GraphNode, GraphEdge, AlgorithmInfo } from '../types';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    }

    // Sorting
    async executeSorting(algorithm: string, array: number[]): Promise<SortingResponse> {
        return this.post(`/api/v1/sorting/${algorithm}`, { array });
    }

    // Searching
    async executeSearching(algorithm: string, array: number[], target: number): Promise<SearchingResponse> {
        return this.post(`/api/v1/searching/${algorithm}`, { array, target });
    }

    // Graph
    async executeGraph(algorithm: string, nodes: GraphNode[], edges: GraphEdge[], startNode?: string, endNode?: string): Promise<GraphResponse> {
        return this.post(`/api/v1/graph/${algorithm}`, { nodes, edges, start_node: startNode, end_node: endNode });
    }

    // Tree
    async executeTree(algorithm: string, values?: number[], value?: number): Promise<TreeResponse> {
        return this.post(`/api/v1/tree/${algorithm}`, { values, value });
    }

    // Dynamic Programming
    async executeDP(algorithm: string, inputData: unknown, n?: number, capacity?: number): Promise<DPResponse> {
        return this.post(`/api/v1/dp/${algorithm}`, { input_data: inputData, n, capacity });
    }

    // Get all algorithms
    async getAllAlgorithms(): Promise<AlgorithmInfo[]> {
        return this.get('/api/v1/algorithms');
    }
}

export const apiService = new ApiService();
