import React, { useState, useCallback } from 'react';
import './DataStructuresPage.css';

type DataStructure = 'array' | 'stack' | 'queue' | 'linkedlist' | 'hashtable' | 'heap';

interface StackItem {
    value: number;
    id: number;
    isNew?: boolean;
    isPopping?: boolean;
}

interface QueueItem {
    value: number;
    id: number;
    isNew?: boolean;
    isDequeuing?: boolean;
}

interface LinkedListNode {
    value: number;
    id: number;
    isNew?: boolean;
    isDeleting?: boolean;
    isHighlighted?: boolean;
}

interface HashTableEntry {
    key: string;
    value: number;
    id: number;
    isNew?: boolean;
    isDeleting?: boolean;
}

interface HeapItem {
    value: number;
    id: number;
    isNew?: boolean;
    isRemoving?: boolean;
    isHighlighted?: boolean;
}

const DATA_STRUCTURES = [
    { id: 'array' as DataStructure, name: 'Array', description: 'Contiguous memory storage' },
    { id: 'stack' as DataStructure, name: 'Stack', description: 'LIFO - Last In First Out' },
    { id: 'queue' as DataStructure, name: 'Queue', description: 'FIFO - First In First Out' },
    { id: 'linkedlist' as DataStructure, name: 'Linked List', description: 'Sequential nodes with pointers' },
    { id: 'hashtable' as DataStructure, name: 'Hash Table', description: 'Key-value storage with hashing' },
    { id: 'heap' as DataStructure, name: 'Heap', description: 'Priority Queue - Min/Max Heap' },
];

// C++ Code snippets for data structures
const DS_CODE: Record<string, { title: string; lines: string[] }> = {
    array: {
        title: 'Array Operations (C++)',
        lines: [
            '#include <iostream>',
            'using namespace std;',
            '',
            '// Array declaration',
            'int arr[100];  // Static array',
            'int n = 0;     // Current size',
            '',
            '// Access element - O(1)',
            'int access(int index) {',
            '    return arr[index];',
            '}',
            '',
            '// Insert at end - O(1)',
            'void insertEnd(int value) {',
            '    arr[n++] = value;',
            '}',
            '',
            '// Insert at index - O(n)',
            'void insertAt(int index, int value) {',
            '    for (int i = n; i > index; i--) {',
            '        arr[i] = arr[i-1];',
            '    }',
            '    arr[index] = value;',
            '    n++;',
            '}',
            '',
            '// Delete at index - O(n)',
            'void deleteAt(int index) {',
            '    for (int i = index; i < n-1; i++) {',
            '        arr[i] = arr[i+1];',
            '    }',
            '    n--;',
            '}',
        ],
    },
    stack: {
        title: 'Stack Operations (C++)',
        lines: [
            '#include <iostream>',
            'using namespace std;',
            '',
            'int stack[100];',
            'int top = -1;',
            '',
            '// Push - O(1)',
            'void push(int value) {',
            '    if (top >= 99) {',
            '        cout << "Stack Overflow";',
            '        return;',
            '    }',
            '    stack[++top] = value;',
            '}',
            '',
            '// Pop - O(1)',
            'int pop() {',
            '    if (top < 0) {',
            '        cout << "Stack Underflow";',
            '        return -1;',
            '    }',
            '    return stack[top--];',
            '}',
            '',
            '// Peek - O(1)',
            'int peek() {',
            '    if (top < 0) {',
            '        return -1;',
            '    }',
            '    return stack[top];',
            '}',
            '',
            '// isEmpty - O(1)',
            'bool isEmpty() {',
            '    return top < 0;',
            '}',
        ],
    },
    queue: {
        title: 'Queue Operations (C++)',
        lines: [
            '#include <iostream>',
            'using namespace std;',
            '',
            'int queue[100];',
            'int front = 0, rear = -1;',
            'int size = 0;',
            '',
            '// Enqueue - O(1)',
            'void enqueue(int value) {',
            '    if (size >= 100) {',
            '        cout << "Queue Overflow";',
            '        return;',
            '    }',
            '    rear = (rear + 1) % 100;',
            '    queue[rear] = value;',
            '    size++;',
            '}',
            '',
            '// Dequeue - O(1)',
            'int dequeue() {',
            '    if (size <= 0) {',
            '        cout << "Queue Underflow";',
            '        return -1;',
            '    }',
            '    int value = queue[front];',
            '    front = (front + 1) % 100;',
            '    size--;',
            '    return value;',
            '}',
            '',
            '// Front - O(1)',
            'int getFront() {',
            '    if (size <= 0) return -1;',
            '    return queue[front];',
            '}',
            '',
            '// isEmpty - O(1)',
            'bool isEmpty() {',
            '    return size <= 0;',
            '}',
        ],
    },
    linkedlist: {
        title: 'Linked List (C++)',
        lines: [
            '#include <iostream>',
            'using namespace std;',
            '',
            'struct Node {',
            '    int data;',
            '    Node* next;',
            '    Node(int val) : data(val), next(nullptr) {}',
            '};',
            '',
            'Node* head = nullptr;',
            '',
            '// Insert at head - O(1)',
            'void insertHead(int value) {',
            '    Node* newNode = new Node(value);',
            '    newNode->next = head;',
            '    head = newNode;',
            '}',
            '',
            '// Insert at tail - O(n)',
            'void insertTail(int value) {',
            '    Node* newNode = new Node(value);',
            '    if (!head) { head = newNode; return; }',
            '    Node* temp = head;',
            '    while (temp->next) temp = temp->next;',
            '    temp->next = newNode;',
            '}',
            '',
            '// Insert at position - O(n)',
            'void insertAt(int pos, int value) {',
            '    if (pos == 0) { insertHead(value); return; }',
            '    Node* newNode = new Node(value);',
            '    Node* temp = head;',
            '    for (int i = 0; i < pos - 1 && temp; i++)',
            '        temp = temp->next;',
            '    if (temp) {',
            '        newNode->next = temp->next;',
            '        temp->next = newNode;',
            '    }',
            '}',
            '',
            '// Delete node - O(n)',
            'void deleteNode(int value) {',
            '    if (!head) return;',
            '    if (head->data == value) {',
            '        Node* temp = head;',
            '        head = head->next;',
            '        delete temp;',
            '        return;',
            '    }',
            '    Node* curr = head;',
            '    while (curr->next && curr->next->data != value)',
            '        curr = curr->next;',
            '    if (curr->next) {',
            '        Node* temp = curr->next;',
            '        curr->next = temp->next;',
            '        delete temp;',
            '    }',
            '}',
            '',
            '// Search - O(n)',
            'bool search(int value) {',
            '    Node* temp = head;',
            '    while (temp) {',
            '        if (temp->data == value) return true;',
            '        temp = temp->next;',
            '    }',
            '    return false;',
            '}',
        ],
    },
    hashtable: {
        title: 'Hash Table (C++)',
        lines: [
            '#include <iostream>',
            '#include <list>',
            'using namespace std;',
            '',
            'const int TABLE_SIZE = 10;',
            'list<pair<string, int>> table[TABLE_SIZE];',
            '',
            '// Hash function',
            'int hashFunc(string key) {',
            '    int sum = 0;',
            '    for (char c : key) sum += c;',
            '    return sum % TABLE_SIZE;',
            '}',
            '',
            '// Insert - O(1) average',
            'void insert(string key, int value) {',
            '    int idx = hashFunc(key);',
            '    for (auto& p : table[idx]) {',
            '        if (p.first == key) {',
            '            p.second = value;',
            '            return;',
            '        }',
            '    }',
            '    table[idx].push_back({key, value});',
            '}',
            '',
            '// Get - O(1) average',
            'int get(string key) {',
            '    int idx = hashFunc(key);',
            '    for (auto& p : table[idx]) {',
            '        if (p.first == key) return p.second;',
            '    }',
            '    return -1; // Not found',
            '}',
            '',
            '// Delete - O(1) average',
            'void remove(string key) {',
            '    int idx = hashFunc(key);',
            '    table[idx].remove_if([&](auto& p) {',
            '        return p.first == key;',
            '    });',
            '}',
        ],
    },
    heap: {
        title: 'Heap / Priority Queue (C++)',
        lines: [
            '#include <iostream>',
            '#include <queue>',
            'using namespace std;',
            '',
            '// Max Heap (default)',
            'priority_queue<int> maxHeap;',
            '',
            '// Min Heap',
            'priority_queue<int, vector<int>,',
            '               greater<int>> minHeap;',
            '',
            '// Insert - O(log n)',
            'void insert(int value) {',
            '    maxHeap.push(value);',
            '    // minHeap.push(value);',
            '}',
            '',
            '// Get Top - O(1)',
            'int getTop() {',
            '    if (maxHeap.empty()) return -1;',
            '    return maxHeap.top();',
            '}',
            '',
            '// Extract Top - O(log n)',
            'int extractTop() {',
            '    if (maxHeap.empty()) return -1;',
            '    int top = maxHeap.top();',
            '    maxHeap.pop();',
            '    return top;',
            '}',
            '',
            '// Size - O(1)',
            'int size() {',
            '    return maxHeap.size();',
            '}',
            '',
            '// isEmpty - O(1)',
            'bool isEmpty() {',
            '    return maxHeap.empty();',
            '}',
        ],
    },
};

export const DataStructuresPage: React.FC = () => {
    const [selectedDS, setSelectedDS] = useState<DataStructure>('array');

    // Stack state
    const [stack, setStack] = useState<StackItem[]>([]);
    const [stackNextId, setStackNextId] = useState(0);
    const [peekValue, setPeekValue] = useState<number | null>(null);

    // Queue state
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [queueNextId, setQueueNextId] = useState(0);
    const [frontValue, setFrontValue] = useState<number | null>(null);

    // Shared state
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    // Code panel state
    const [showCodePanel, setShowCodePanel] = useState(false);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 2000);
    };

    // Stack Operations
    const push = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }

        const newItem: StackItem = { value, id: stackNextId, isNew: true };
        setStack(prev => [...prev, newItem]);
        setStackNextId(prev => prev + 1);
        setInputValue('');
        setPeekValue(null);

        setTimeout(() => {
            setStack(prev => prev.map(item =>
                item.id === newItem.id ? { ...item, isNew: false } : item
            ));
        }, 300);

        showMessage(`Pushed ${value}`);
    }, [inputValue, stackNextId]);

    const pop = useCallback(() => {
        if (stack.length === 0) {
            showMessage('Stack is empty!');
            return;
        }

        setStack(prev => prev.map((item, index) =>
            index === prev.length - 1 ? { ...item, isPopping: true } : item
        ));

        setTimeout(() => {
            setStack(prev => {
                const popped = prev[prev.length - 1];
                showMessage(`Popped ${popped.value}`);
                return prev.slice(0, -1);
            });
        }, 300);

        setPeekValue(null);
    }, [stack]);

    const peek = useCallback(() => {
        if (stack.length === 0) {
            showMessage('Stack is empty!');
            return;
        }

        const topValue = stack[stack.length - 1].value;
        setPeekValue(topValue);
        showMessage(`Top element: ${topValue}`);
    }, [stack]);

    const clearStack = useCallback(() => {
        setStack([]);
        setPeekValue(null);
        showMessage('Stack cleared');
    }, []);

    // Queue Operations
    const enqueue = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }

        const newItem: QueueItem = { value, id: queueNextId, isNew: true };
        setQueue(prev => [...prev, newItem]);
        setQueueNextId(prev => prev + 1);
        setInputValue('');
        setFrontValue(null);

        setTimeout(() => {
            setQueue(prev => prev.map(item =>
                item.id === newItem.id ? { ...item, isNew: false } : item
            ));
        }, 300);

        showMessage(`Enqueued ${value}`);
    }, [inputValue, queueNextId]);

    const dequeue = useCallback(() => {
        if (queue.length === 0) {
            showMessage('Queue is empty!');
            return;
        }

        setQueue(prev => prev.map((item, index) =>
            index === 0 ? { ...item, isDequeuing: true } : item
        ));

        setTimeout(() => {
            setQueue(prev => {
                const removed = prev[0];
                showMessage(`Dequeued ${removed.value}`);
                return prev.slice(1);
            });
        }, 300);

        setFrontValue(null);
    }, [queue]);

    const front = useCallback(() => {
        if (queue.length === 0) {
            showMessage('Queue is empty!');
            return;
        }

        const frontVal = queue[0].value;
        setFrontValue(frontVal);
        showMessage(`Front element: ${frontVal}`);
    }, [queue]);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setFrontValue(null);
        showMessage('Queue cleared');
    }, []);

    // Array state
    const [array, setArray] = useState<number[]>([10, 25, 8, 42, 15, 33]);
    const [arrayIndex, setArrayIndex] = useState('');
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

    // Array Operations
    const insertAtEnd = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        setArray(prev => [...prev, value]);
        setInputValue('');
        setHighlightIndex(array.length);
        setTimeout(() => setHighlightIndex(null), 500);
        showMessage(`Inserted ${value} at index ${array.length}`);
    }, [inputValue, array.length]);

    const insertAtIndex = useCallback(() => {
        const value = parseInt(inputValue);
        const index = parseInt(arrayIndex);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        if (isNaN(index) || index < 0 || index > array.length) {
            showMessage(`Invalid index (0-${array.length})`);
            return;
        }
        const newArray = [...array];
        newArray.splice(index, 0, value);
        setArray(newArray);
        setInputValue('');
        setArrayIndex('');
        setHighlightIndex(index);
        setTimeout(() => setHighlightIndex(null), 500);
        showMessage(`Inserted ${value} at index ${index}`);
    }, [inputValue, arrayIndex, array]);

    const deleteAtIndex = useCallback(() => {
        const index = parseInt(arrayIndex);
        if (isNaN(index) || index < 0 || index >= array.length) {
            showMessage(`Invalid index (0-${array.length - 1})`);
            return;
        }
        const deleted = array[index];
        setHighlightIndex(index);
        setTimeout(() => {
            setArray(prev => prev.filter((_, i) => i !== index));
            setHighlightIndex(null);
            showMessage(`Deleted ${deleted} from index ${index}`);
        }, 300);
        setArrayIndex('');
    }, [arrayIndex, array]);

    const accessIndex = useCallback(() => {
        const index = parseInt(arrayIndex);
        if (isNaN(index) || index < 0 || index >= array.length) {
            showMessage(`Invalid index (0-${array.length - 1})`);
            return;
        }
        setHighlightIndex(index);
        showMessage(`arr[${index}] = ${array[index]}`);
        setTimeout(() => setHighlightIndex(null), 1500);
    }, [arrayIndex, array]);

    const clearArray = useCallback(() => {
        setArray([]);
        setHighlightIndex(null);
        showMessage('Array cleared');
    }, []);

    // Linked List state
    const [linkedList, setLinkedList] = useState<LinkedListNode[]>([
        { value: 10, id: 0 },
        { value: 25, id: 1 },
        { value: 8, id: 2 },
    ]);
    const [llNextId, setLlNextId] = useState(3);
    const [searchedNode, setSearchedNode] = useState<number | null>(null);
    const [llPosition, setLlPosition] = useState('');

    // Linked List Operations
    const insertHead = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        const newNode: LinkedListNode = { value, id: llNextId, isNew: true };
        setLinkedList(prev => [newNode, ...prev]);
        setLlNextId(prev => prev + 1);
        setInputValue('');
        setTimeout(() => {
            setLinkedList(prev => prev.map(node =>
                node.id === newNode.id ? { ...node, isNew: false } : node
            ));
        }, 300);
        showMessage(`Inserted ${value} at head`);
    }, [inputValue, llNextId]);

    const insertTail = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        const newNode: LinkedListNode = { value, id: llNextId, isNew: true };
        setLinkedList(prev => [...prev, newNode]);
        setLlNextId(prev => prev + 1);
        setInputValue('');
        setTimeout(() => {
            setLinkedList(prev => prev.map(node =>
                node.id === newNode.id ? { ...node, isNew: false } : node
            ));
        }, 300);
        showMessage(`Inserted ${value} at tail`);
    }, [inputValue, llNextId]);

    const insertAtPosition = useCallback(() => {
        const value = parseInt(inputValue);
        const position = parseInt(llPosition);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        if (isNaN(position) || position < 0 || position > linkedList.length) {
            showMessage(`Invalid position (0-${linkedList.length})`);
            return;
        }
        const newNode: LinkedListNode = { value, id: llNextId, isNew: true };
        setLinkedList(prev => [
            ...prev.slice(0, position),
            newNode,
            ...prev.slice(position)
        ]);
        setLlNextId(prev => prev + 1);
        setInputValue('');
        setLlPosition('');
        setTimeout(() => {
            setLinkedList(prev => prev.map(node =>
                node.id === newNode.id ? { ...node, isNew: false } : node
            ));
        }, 300);
        showMessage(`Inserted ${value} at position ${position}`);
    }, [inputValue, llPosition, llNextId, linkedList.length]);

    const deleteNode = useCallback(() => {
        const position = parseInt(llPosition);
        const value = parseInt(inputValue);

        // If position is provided, delete by position
        if (!isNaN(position) && llPosition.trim() !== '') {
            if (position < 0 || position >= linkedList.length) {
                showMessage(`Invalid position (0-${linkedList.length - 1})`);
                return;
            }
            const deletedValue = linkedList[position].value;
            setLinkedList(prev => prev.map((node, i) =>
                i === position ? { ...node, isDeleting: true } : node
            ));
            setTimeout(() => {
                setLinkedList(prev => prev.filter((_, i) => i !== position));
                showMessage(`Deleted ${deletedValue} at position ${position}`);
            }, 300);
            setLlPosition('');
            return;
        }

        // Otherwise, delete by value
        if (isNaN(value)) {
            showMessage('Enter a value or position to delete');
            return;
        }
        const nodeIndex = linkedList.findIndex(node => node.value === value);
        if (nodeIndex === -1) {
            showMessage(`Value ${value} not found`);
            return;
        }
        setLinkedList(prev => prev.map((node, i) =>
            i === nodeIndex ? { ...node, isDeleting: true } : node
        ));
        setTimeout(() => {
            setLinkedList(prev => prev.filter((_, i) => i !== nodeIndex));
            showMessage(`Deleted ${value}`);
        }, 300);
        setInputValue('');
    }, [inputValue, llPosition, linkedList]);


    const searchNode = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a value to search');
            return;
        }
        const nodeIndex = linkedList.findIndex(node => node.value === value);
        if (nodeIndex === -1) {
            showMessage(`Value ${value} not found`);
            setSearchedNode(null);
            return;
        }
        setSearchedNode(linkedList[nodeIndex].id);
        showMessage(`Found ${value} at position ${nodeIndex}`);
        setTimeout(() => setSearchedNode(null), 2000);
    }, [inputValue, linkedList]);

    const clearLinkedList = useCallback(() => {
        setLinkedList([]);
        setSearchedNode(null);
        showMessage('Linked List cleared');
    }, []);

    // Hash Table state (using bucket approach)
    const BUCKET_COUNT = 7;
    const [hashTable, setHashTable] = useState<(HashTableEntry | null)[][]>(
        Array(BUCKET_COUNT).fill(null).map(() => [])
    );
    const [htNextId, setHtNextId] = useState(0);
    const [keyInput, setKeyInput] = useState('');
    const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);

    const hashFunction = useCallback((key: string): number => {
        let sum = 0;
        for (let i = 0; i < key.length; i++) {
            sum += key.charCodeAt(i);
        }
        return sum % BUCKET_COUNT;
    }, []);

    const htInsert = useCallback(() => {
        if (!keyInput.trim()) {
            showMessage('Please enter a key');
            return;
        }
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid value');
            return;
        }
        const bucket = hashFunction(keyInput);
        setHighlightedBucket(bucket);

        setHashTable(prev => {
            const newTable = prev.map(b => [...b]);
            const existingIndex = newTable[bucket].findIndex(e => e?.key === keyInput);
            if (existingIndex !== -1) {
                newTable[bucket][existingIndex] = { key: keyInput, value, id: newTable[bucket][existingIndex]!.id };
                showMessage(`Updated ${keyInput} = ${value}`);
            } else {
                newTable[bucket].push({ key: keyInput, value, id: htNextId, isNew: true });
                setHtNextId(prev => prev + 1);
                showMessage(`Inserted ${keyInput} = ${value} in bucket ${bucket}`);
            }
            return newTable;
        });

        setTimeout(() => {
            setHashTable(prev => prev.map(bucket =>
                bucket.map(entry => entry ? { ...entry, isNew: false } : entry)
            ));
            setHighlightedBucket(null);
        }, 500);

        setKeyInput('');
        setInputValue('');
    }, [keyInput, inputValue, hashFunction, htNextId]);

    const htGet = useCallback(() => {
        if (!keyInput.trim()) {
            showMessage('Please enter a key to search');
            return;
        }
        const bucket = hashFunction(keyInput);
        setHighlightedBucket(bucket);

        const entry = hashTable[bucket].find(e => e?.key === keyInput);
        if (entry) {
            showMessage(`${keyInput} = ${entry.value}`);
        } else {
            showMessage(`Key "${keyInput}" not found`);
        }

        setTimeout(() => setHighlightedBucket(null), 1500);
    }, [keyInput, hashFunction, hashTable]);

    const htDelete = useCallback(() => {
        if (!keyInput.trim()) {
            showMessage('Please enter a key to delete');
            return;
        }
        const bucket = hashFunction(keyInput);
        const entry = hashTable[bucket].find(e => e?.key === keyInput);

        if (!entry) {
            showMessage(`Key "${keyInput}" not found`);
            return;
        }

        setHighlightedBucket(bucket);
        setHashTable(prev => {
            const newTable = prev.map(b => [...b]);
            newTable[bucket] = newTable[bucket].map(e =>
                e?.key === keyInput ? { ...e, isDeleting: true } : e
            );
            return newTable;
        });

        setTimeout(() => {
            setHashTable(prev => {
                const newTable = prev.map(b => [...b]);
                newTable[bucket] = newTable[bucket].filter(e => e?.key !== keyInput);
                return newTable;
            });
            setHighlightedBucket(null);
            showMessage(`Deleted "${keyInput}"`);
        }, 300);

        setKeyInput('');
    }, [keyInput, hashFunction, hashTable]);

    const clearHashTable = useCallback(() => {
        setHashTable(Array(BUCKET_COUNT).fill(null).map(() => []));
        setHighlightedBucket(null);
        showMessage('Hash Table cleared');
    }, []);

    // Heap state
    const [heap, setHeap] = useState<HeapItem[]>([]);
    const [heapNextId, setHeapNextId] = useState(0);
    const [isMinHeap, setIsMinHeap] = useState(false); // false = max heap, true = min heap
    const [topValue, setTopValue] = useState<number | null>(null);

    // Heap helper functions
    const heapifyUp = useCallback((arr: HeapItem[], index: number, isMin: boolean): HeapItem[] => {
        const result = [...arr];
        let current = index;
        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);
            const shouldSwap = isMin
                ? result[current].value < result[parent].value
                : result[current].value > result[parent].value;
            if (shouldSwap) {
                [result[current], result[parent]] = [result[parent], result[current]];
                current = parent;
            } else {
                break;
            }
        }
        return result;
    }, []);

    const heapifyDown = useCallback((arr: HeapItem[], index: number, isMin: boolean): HeapItem[] => {
        const result = [...arr];
        let current = index;
        const length = result.length;

        while (true) {
            const left = 2 * current + 1;
            const right = 2 * current + 2;
            let target = current;

            if (left < length) {
                const shouldSwap = isMin
                    ? result[left].value < result[target].value
                    : result[left].value > result[target].value;
                if (shouldSwap) target = left;
            }
            if (right < length) {
                const shouldSwap = isMin
                    ? result[right].value < result[target].value
                    : result[right].value > result[target].value;
                if (shouldSwap) target = right;
            }

            if (target !== current) {
                [result[current], result[target]] = [result[target], result[current]];
                current = target;
            } else {
                break;
            }
        }
        return result;
    }, []);

    const heapInsert = useCallback(() => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            showMessage('Please enter a valid number');
            return;
        }
        const newItem: HeapItem = { value, id: heapNextId, isNew: true };
        setHeap(prev => {
            const newHeap = [...prev, newItem];
            return heapifyUp(newHeap, newHeap.length - 1, isMinHeap);
        });
        setHeapNextId(prev => prev + 1);
        setInputValue('');
        setTopValue(null);
        setTimeout(() => {
            setHeap(prev => prev.map(item => ({ ...item, isNew: false })));
        }, 300);
        showMessage(`Inserted ${value} into ${isMinHeap ? 'Min' : 'Max'} Heap`);
    }, [inputValue, heapNextId, isMinHeap, heapifyUp]);

    const heapExtractTop = useCallback(() => {
        if (heap.length === 0) {
            showMessage('Heap is empty!');
            return;
        }
        const topVal = heap[0].value;
        setHeap(prev => prev.map((item, i) =>
            i === 0 ? { ...item, isRemoving: true } : item
        ));
        setTimeout(() => {
            setHeap(prev => {
                if (prev.length <= 1) return [];
                const newHeap = [...prev];
                newHeap[0] = newHeap[newHeap.length - 1];
                newHeap.pop();
                return heapifyDown(newHeap, 0, isMinHeap);
            });
            showMessage(`Extracted ${topVal} from ${isMinHeap ? 'Min' : 'Max'} Heap`);
        }, 300);
    }, [heap, isMinHeap, heapifyDown]);

    const heapPeek = useCallback(() => {
        if (heap.length === 0) {
            showMessage('Heap is empty!');
            return;
        }
        setTopValue(heap[0].value);
        setHeap(prev => prev.map((item, i) =>
            i === 0 ? { ...item, isHighlighted: true } : item
        ));
        showMessage(`Top: ${heap[0].value}`);
        setTimeout(() => {
            setHeap(prev => prev.map(item => ({ ...item, isHighlighted: false })));
            setTopValue(null);
        }, 1500);
    }, [heap]);

    const clearHeap = useCallback(() => {
        setHeap([]);
        setTopValue(null);
        showMessage('Heap cleared');
    }, []);

    const toggleHeapType = useCallback(() => {
        setIsMinHeap(prev => !prev);
        setHeap([]);
        setTopValue(null);
        showMessage(`Switched to ${!isMinHeap ? 'Min' : 'Max'} Heap`);
    }, [isMinHeap]);

    const currentDS = DATA_STRUCTURES.find(ds => ds.id === selectedDS);

    return (
        <div className="ds-page">
            {/* Header */}
            <div className="ds-header">
                <h1 className="ds-title">
                    <span className="ds-icon">🗃️</span>
                    Data Structures
                </h1>
                <p className="ds-subtitle">Interactive visualization of fundamental data structures</p>
            </div>

            {/* Data Structure Selection */}
            <div className="ds-selection">
                {DATA_STRUCTURES.map(ds => (
                    <button
                        key={ds.id}
                        className={`ds-btn ${selectedDS === ds.id ? 'active' : ''}`}
                        onClick={() => setSelectedDS(ds.id)}
                    >
                        <span className="ds-btn-name">{ds.name}</span>
                        <span className="ds-btn-desc">{ds.description}</span>
                    </button>
                ))}
            </div>

            {/* Main Layout */}
            <div className="ds-main-layout">
                <div className="ds-top-section">
                    {/* Visualizer Panel */}
                    <div className="ds-visualizer-panel">
                        <div className="panel-header">
                            <h2>{currentDS?.name} Visualization</h2>
                        </div>

                        {/* Array Visualizer */}
                        {selectedDS === 'array' && (
                            <div className="array-visualizer">
                                <div className="array-container">
                                    {array.length === 0 ? (
                                        <div className="array-empty">
                                            <span>Array is empty</span>
                                            <span className="array-hint">Add elements to get started</span>
                                        </div>
                                    ) : (
                                        <div className="array-items">
                                            {array.map((value, index) => (
                                                <div
                                                    key={index}
                                                    className={`array-item ${highlightIndex === index ? 'highlighted' : ''}`}
                                                >
                                                    <span className="array-value">{value}</span>
                                                    <span className="array-index">{index}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="array-info">
                                    <div className="info-item">
                                        <span className="info-label">Length:</span>
                                        <span className="info-value">{array.length}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Indices:</span>
                                        <span className="info-value">0 - {Math.max(0, array.length - 1)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stack Visualizer */}
                        {selectedDS === 'stack' && (
                            <div className="stack-visualizer">
                                <div className="stack-container">
                                    {stack.length === 0 ? (
                                        <div className="stack-empty">
                                            <span>Stack is empty</span>
                                            <span className="stack-hint">Push elements to get started</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="stack-top-pointer">
                                                <span>TOP →</span>
                                            </div>
                                            <div className="stack-items">
                                                {stack.slice().reverse().map((item, reversedIndex) => {
                                                    const actualIndex = stack.length - 1 - reversedIndex;
                                                    const isTop = actualIndex === stack.length - 1;
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={`stack-item ${isTop ? 'top' : ''} ${item.isNew ? 'entering' : ''} ${item.isPopping ? 'exiting' : ''} ${peekValue !== null && isTop ? 'peeking' : ''}`}
                                                        >
                                                            <span className="stack-value">{item.value}</span>
                                                            <span className="stack-index">[{actualIndex}]</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="stack-base">
                                                <span>BOTTOM</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="stack-info">
                                    <div className="info-item">
                                        <span className="info-label">Size:</span>
                                        <span className="info-value">{stack.length}</span>
                                    </div>
                                    {peekValue !== null && (
                                        <div className="info-item highlight">
                                            <span className="info-label">Top:</span>
                                            <span className="info-value">{peekValue}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Queue Visualizer */}
                        {selectedDS === 'queue' && (
                            <div className="queue-visualizer">
                                <div className="queue-container">
                                    {queue.length === 0 ? (
                                        <div className="queue-empty">
                                            <span>Queue is empty</span>
                                            <span className="queue-hint">Enqueue elements to get started</span>
                                        </div>
                                    ) : (
                                        <div className="queue-wrapper">
                                            <div className="queue-pointer front-pointer">
                                                <span>FRONT</span>
                                                <span className="pointer-arrow">↓</span>
                                            </div>
                                            <div className="queue-items">
                                                {queue.map((item, index) => {
                                                    const isFront = index === 0;
                                                    const isRear = index === queue.length - 1;
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={`queue-item ${isFront ? 'front' : ''} ${isRear ? 'rear' : ''} ${item.isNew ? 'entering' : ''} ${item.isDequeuing ? 'exiting' : ''} ${frontValue !== null && isFront ? 'peeking' : ''}`}
                                                        >
                                                            <span className="queue-value">{item.value}</span>
                                                            <span className="queue-index">[{index}]</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="queue-pointer rear-pointer">
                                                <span>REAR</span>
                                                <span className="pointer-arrow">↓</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="queue-info">
                                    <div className="info-item">
                                        <span className="info-label">Size:</span>
                                        <span className="info-value">{queue.length}</span>
                                    </div>
                                    {frontValue !== null && (
                                        <div className="info-item highlight">
                                            <span className="info-label">Front:</span>
                                            <span className="info-value">{frontValue}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Linked List Visualizer */}
                        {selectedDS === 'linkedlist' && (
                            <div className="linkedlist-visualizer">
                                <div className="ll-container">
                                    {linkedList.length === 0 ? (
                                        <div className="ll-empty">
                                            <span>Linked List is empty</span>
                                            <span className="ll-hint">Add nodes to get started</span>
                                        </div>
                                    ) : (
                                        <div className="ll-nodes">
                                            <div className="ll-head-label">HEAD</div>
                                            {linkedList.map((node, index) => (
                                                <div key={node.id} className="ll-node-wrapper">
                                                    <div
                                                        className={`ll-node ${node.isNew ? 'entering' : ''} ${node.isDeleting ? 'exiting' : ''} ${searchedNode === node.id ? 'found' : ''}`}
                                                    >
                                                        <div className="ll-node-data">
                                                            <span className="ll-value">{node.value}</span>
                                                        </div>
                                                        <div className="ll-node-next">
                                                            {index < linkedList.length - 1 ? '→' : '∅'}
                                                        </div>
                                                    </div>
                                                    {index < linkedList.length - 1 && (
                                                        <div className="ll-arrow">→</div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="ll-null">NULL</div>
                                        </div>
                                    )}
                                </div>

                                <div className="ll-info">
                                    <div className="info-item">
                                        <span className="info-label">Length:</span>
                                        <span className="info-value">{linkedList.length}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hash Table Visualizer */}
                        {selectedDS === 'hashtable' && (
                            <div className="hashtable-visualizer">
                                <div className="ht-container">
                                    {hashTable.map((bucket, bucketIndex) => (
                                        <div
                                            key={bucketIndex}
                                            className={`ht-bucket ${highlightedBucket === bucketIndex ? 'highlighted' : ''}`}
                                        >
                                            <div className="ht-bucket-index">{bucketIndex}</div>
                                            <div className="ht-bucket-content">
                                                {bucket.length === 0 ? (
                                                    <span className="ht-empty-slot">empty</span>
                                                ) : (
                                                    bucket.map((entry, entryIndex) => entry && (
                                                        <div
                                                            key={entry.id}
                                                            className={`ht-entry ${entry.isNew ? 'entering' : ''} ${entry.isDeleting ? 'exiting' : ''}`}
                                                        >
                                                            <span className="ht-key">{entry.key}</span>
                                                            <span className="ht-separator">:</span>
                                                            <span className="ht-value">{entry.value}</span>
                                                            {entryIndex < bucket.length - 1 && (
                                                                <span className="ht-chain-arrow">→</span>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="ht-info">
                                    <div className="info-item">
                                        <span className="info-label">Buckets:</span>
                                        <span className="info-value">{BUCKET_COUNT}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Entries:</span>
                                        <span className="info-value">{hashTable.reduce((sum, b) => sum + b.length, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Heap Visualizer */}
                        {selectedDS === 'heap' && (
                            <div className="heap-visualizer">
                                <div className="heap-type-toggle">
                                    <button
                                        className={`heap-type-btn ${!isMinHeap ? 'active' : ''}`}
                                        onClick={() => { if (isMinHeap) toggleHeapType(); }}
                                    >
                                        Max Heap
                                    </button>
                                    <button
                                        className={`heap-type-btn ${isMinHeap ? 'active' : ''}`}
                                        onClick={() => { if (!isMinHeap) toggleHeapType(); }}
                                    >
                                        Min Heap
                                    </button>
                                </div>

                                <div className="heap-container">
                                    {heap.length === 0 ? (
                                        <div className="heap-empty">
                                            <span>Heap is empty</span>
                                            <span className="heap-hint">Insert elements to build the {isMinHeap ? 'Min' : 'Max'} Heap</span>
                                        </div>
                                    ) : (
                                        <div className="heap-tree">
                                            {/* Array representation */}
                                            <div className="heap-array">
                                                {heap.map((item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className={`heap-node ${item.isNew ? 'entering' : ''} ${item.isRemoving ? 'exiting' : ''} ${item.isHighlighted ? 'highlighted' : ''} ${index === 0 ? 'root' : ''}`}
                                                    >
                                                        <span className="heap-value">{item.value}</span>
                                                        <span className="heap-index">[{index}]</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Tree structure hint */}
                                            <div className="heap-tree-hint">
                                                <span>Root</span>
                                                <span className="hint-arrow">↓</span>
                                                <span>Parent of [i] = [(i-1)/2]</span>
                                                <span className="hint-separator">|</span>
                                                <span>Left child = [2i+1]</span>
                                                <span className="hint-separator">|</span>
                                                <span>Right child = [2i+2]</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="heap-info">
                                    <div className="info-item">
                                        <span className="info-label">Type:</span>
                                        <span className="info-value">{isMinHeap ? 'Min Heap' : 'Max Heap'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Size:</span>
                                        <span className="info-value">{heap.length}</span>
                                    </div>
                                    {topValue !== null && (
                                        <div className="info-item highlight">
                                            <span className="info-label">Top:</span>
                                            <span className="info-value">{topValue}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls Panel */}
                    <div className="ds-controls-panel">
                        <div className="panel-header">
                            <h2>Operations</h2>
                        </div>

                        {/* Array Controls */}
                        {selectedDS === 'array' && (
                            <div className="array-controls">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Enter number"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Index:</label>
                                    <input
                                        type="number"
                                        value={arrayIndex}
                                        onChange={(e) => setArrayIndex(e.target.value)}
                                        placeholder="0-..."
                                        style={{ width: '80px' }}
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn insert-end" onClick={insertAtEnd}>
                                        <span className="op-icon">➕</span>
                                        Insert End
                                    </button>
                                    <button className="op-btn insert-at" onClick={insertAtIndex}>
                                        <span className="op-icon">📍</span>
                                        Insert At
                                    </button>
                                    <button className="op-btn delete-at" onClick={deleteAtIndex} disabled={array.length === 0}>
                                        <span className="op-icon">🗑️</span>
                                        Delete At
                                    </button>
                                    <button className="op-btn access" onClick={accessIndex} disabled={array.length === 0}>
                                        <span className="op-icon">🔍</span>
                                        Access
                                    </button>
                                </div>

                                <button className="op-btn clear full-width" onClick={clearArray} disabled={array.length === 0}>
                                    <span className="op-icon">🗑️</span>
                                    Clear All
                                </button>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stack Controls */}
                        {selectedDS === 'stack' && (
                            <div className="stack-controls">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && push()}
                                        placeholder="Enter a number"
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn push" onClick={push}>
                                        <span className="op-icon">⬆️</span>
                                        Push
                                    </button>
                                    <button className="op-btn pop" onClick={pop} disabled={stack.length === 0}>
                                        <span className="op-icon">⬇️</span>
                                        Pop
                                    </button>
                                    <button className="op-btn peek" onClick={peek} disabled={stack.length === 0}>
                                        <span className="op-icon">👁️</span>
                                        Peek
                                    </button>
                                    <button className="op-btn clear" onClick={clearStack} disabled={stack.length === 0}>
                                        <span className="op-icon">🗑️</span>
                                        Clear
                                    </button>
                                </div>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Queue Controls */}
                        {selectedDS === 'queue' && (
                            <div className="queue-controls">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                                        placeholder="Enter a number"
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn enqueue" onClick={enqueue}>
                                        <span className="op-icon">➡️</span>
                                        Enqueue
                                    </button>
                                    <button className="op-btn dequeue" onClick={dequeue} disabled={queue.length === 0}>
                                        <span className="op-icon">⬅️</span>
                                        Dequeue
                                    </button>
                                    <button className="op-btn front-btn" onClick={front} disabled={queue.length === 0}>
                                        <span className="op-icon">👁️</span>
                                        Front
                                    </button>
                                    <button className="op-btn clear" onClick={clearQueue} disabled={queue.length === 0}>
                                        <span className="op-icon">🗑️</span>
                                        Clear
                                    </button>
                                </div>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Linked List Controls */}
                        {selectedDS === 'linkedlist' && (
                            <div className="linkedlist-controls">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && insertTail()}
                                        placeholder="Enter a number"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Position:</label>
                                    <input
                                        type="number"
                                        value={llPosition}
                                        onChange={(e) => setLlPosition(e.target.value)}
                                        placeholder={`0-${linkedList.length - 1}`}
                                        style={{ width: '80px' }}
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn insert-head" onClick={insertHead}>
                                        <span className="op-icon">⬅️</span>
                                        Insert Head
                                    </button>
                                    <button className="op-btn insert-tail" onClick={insertTail}>
                                        <span className="op-icon">➡️</span>
                                        Insert Tail
                                    </button>
                                    <button className="op-btn insert-at" onClick={insertAtPosition}>
                                        <span className="op-icon">📍</span>
                                        Insert At
                                    </button>
                                    <button className="op-btn delete-node" onClick={deleteNode} disabled={linkedList.length === 0}>
                                        <span className="op-icon">🗑️</span>
                                        Delete
                                    </button>
                                    <button className="op-btn search-node" onClick={searchNode} disabled={linkedList.length === 0}>
                                        <span className="op-icon">🔍</span>
                                        Search
                                    </button>
                                </div>

                                <button className="op-btn clear full-width" onClick={clearLinkedList} disabled={linkedList.length === 0}>
                                    <span className="op-icon">🗑️</span>
                                    Clear All
                                </button>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Hash Table Controls */}
                        {selectedDS === 'hashtable' && (
                            <div className="hashtable-controls">
                                <div className="input-group">
                                    <label>Key:</label>
                                    <input
                                        type="text"
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        placeholder="Enter key"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && htInsert()}
                                        placeholder="Enter value"
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn ht-insert" onClick={htInsert}>
                                        <span className="op-icon">➕</span>
                                        Insert
                                    </button>
                                    <button className="op-btn ht-get" onClick={htGet}>
                                        <span className="op-icon">🔍</span>
                                        Get
                                    </button>
                                    <button className="op-btn ht-delete" onClick={htDelete}>
                                        <span className="op-icon">🗑️</span>
                                        Delete
                                    </button>
                                </div>

                                <button className="op-btn clear full-width" onClick={clearHashTable}>
                                    <span className="op-icon">🗑️</span>
                                    Clear All
                                </button>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Heap Controls */}
                        {selectedDS === 'heap' && (
                            <div className="heap-controls">
                                <div className="input-group">
                                    <label>Value:</label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && heapInsert()}
                                        placeholder="Enter a number"
                                    />
                                </div>

                                <div className="button-group">
                                    <button className="op-btn heap-insert" onClick={heapInsert}>
                                        <span className="op-icon">➕</span>
                                        Insert
                                    </button>
                                    <button className="op-btn heap-extract" onClick={heapExtractTop} disabled={heap.length === 0}>
                                        <span className="op-icon">⬆️</span>
                                        Extract Top
                                    </button>
                                    <button className="op-btn heap-peek" onClick={heapPeek} disabled={heap.length === 0}>
                                        <span className="op-icon">👁️</span>
                                        Peek
                                    </button>
                                    <button className="op-btn clear" onClick={clearHeap} disabled={heap.length === 0}>
                                        <span className="op-icon">🗑️</span>
                                        Clear
                                    </button>
                                </div>

                                {message && (
                                    <div className="message-display">
                                        {message}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Code Toggle Button */}
            {DS_CODE[selectedDS] && (
                <button
                    className={`code-toggle-floating ${showCodePanel ? 'active' : ''}`}
                    onClick={() => setShowCodePanel(!showCodePanel)}
                >
                    <span>{showCodePanel ? '✕' : '💻'}</span>
                    <span>{showCodePanel ? 'Hide Code' : 'View Code'}</span>
                </button>
            )}

            {/* Floating Code Overlay */}
            {DS_CODE[selectedDS] && (
                <div className={`ds-code-overlay ${showCodePanel ? 'visible' : ''}`}>
                    <div className="panel-header">
                        <h2>💻 {DS_CODE[selectedDS].title}</h2>
                        <button className="close-btn" onClick={() => setShowCodePanel(false)}>✕</button>
                    </div>
                    <div className="code-container">
                        <pre className="code-block">
                            {DS_CODE[selectedDS].lines.map((line, index) => (
                                <div key={index} className="code-line">
                                    <span className="line-number">{index + 1}</span>
                                    <span className="line-content">{line || ' '}</span>
                                </div>
                            ))}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};
