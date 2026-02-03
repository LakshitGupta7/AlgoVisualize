// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
export const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8001';

// Algorithm Categories
export const ALGORITHM_CATEGORIES = {
    sorting: {
        name: 'Sorting',
        icon: '📊',
        algorithms: ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'counting', 'radix'],
    },
    searching: {
        name: 'Searching',
        icon: '🔍',
        algorithms: ['linear', 'binary', 'jump', 'interpolation', 'exponential'],
    },
    graph: {
        name: 'Graph',
        icon: '🔗',
        algorithms: ['bfs', 'dfs', 'dijkstra', 'kruskal', 'prim'],
    },
    tree: {
        name: 'Tree',
        icon: '🌳',
        algorithms: ['inorder', 'preorder', 'postorder', 'levelorder', 'insert', 'search'],
    },
    dp: {
        name: 'Dynamic Programming',
        icon: '🧮',
        algorithms: ['fibonacci', 'knapsack', 'lcs', 'lis'],
    },
};

// Data Structure Categories
export const DATA_STRUCTURES = {
    linear: ['Array', 'Linked List', 'Stack', 'Queue', 'Deque'],
    tree: ['Binary Tree', 'BST', 'AVL Tree', 'Heap'],
    graph: ['Directed Graph', 'Undirected Graph', 'Weighted Graph'],
    hash: ['Hash Table'],
};
