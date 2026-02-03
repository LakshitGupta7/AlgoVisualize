import React from 'react';
import './CodeViewer.css';

interface CodeViewerProps {
    algorithm: string;
    highlightLine?: number;
    highlightType?: 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

// C++ Algorithm code with line numbers for highlighting
const ALGORITHM_CODE: Record<string, { code: string; lines: string[] }> = {
    bubble: {
        code: 'bubbleSort',
        lines: [
            'void bubbleSort(int arr[], int n) {',
            '    for (int i = 0; i < n-1; i++) {',
            '        for (int j = 0; j < n-i-1; j++) {',
            '            // Compare adjacent elements',
            '            if (arr[j] > arr[j+1]) {',
            '                // Swap if left > right',
            '                swap(arr[j], arr[j+1]);',
            '            }',
            '        }',
            '    }',
            '}',
        ],
    },
    selection: {
        code: 'selectionSort',
        lines: [
            'void selectionSort(int arr[], int n) {',
            '    for (int i = 0; i < n-1; i++) {',
            '        int minIdx = i;',
            '        // Find minimum in unsorted portion',
            '        for (int j = i+1; j < n; j++) {',
            '            if (arr[j] < arr[minIdx]) {',
            '                minIdx = j;',
            '            }',
            '        }',
            '        // Swap minimum to sorted position',
            '        swap(arr[i], arr[minIdx]);',
            '    }',
            '}',
        ],
    },
    insertion: {
        code: 'insertionSort',
        lines: [
            'void insertionSort(int arr[], int n) {',
            '    for (int i = 1; i < n; i++) {',
            '        int key = arr[i];',
            '        int j = i - 1;',
            '        // Move elements greater than key',
            '        while (j >= 0 && arr[j] > key) {',
            '            arr[j+1] = arr[j];',
            '            j--;',
            '        }',
            '        // Insert key at correct position',
            '        arr[j+1] = key;',
            '    }',
            '}',
        ],
    },
    merge: {
        code: 'mergeSort',
        lines: [
            'void mergeSort(int arr[], int l, int r) {',
            '    if (l < r) {',
            '        int mid = l + (r - l) / 2;',
            '        // Divide into two halves',
            '        mergeSort(arr, l, mid);',
            '        mergeSort(arr, mid+1, r);',
            '        // Merge the sorted halves',
            '        merge(arr, l, mid, r);',
            '    }',
            '}',
            '',
            'void merge(int arr[], int l, int m, int r) {',
            '    // Compare and merge elements',
            '    while (i < n1 && j < n2) {',
            '        if (L[i] <= R[j]) {',
            '            arr[k++] = L[i++];',
            '        } else {',
            '            arr[k++] = R[j++];',
            '        }',
            '    }',
            '}',
        ],
    },
    quick: {
        code: 'quickSort',
        lines: [
            'void quickSort(int arr[], int low, int high) {',
            '    if (low < high) {',
            '        // Find partition index',
            '        int pi = partition(arr, low, high);',
            '        quickSort(arr, low, pi - 1);',
            '        quickSort(arr, pi + 1, high);',
            '    }',
            '}',
            '',
            'int partition(int arr[], int low, int high) {',
            '    int pivot = arr[high];',
            '    int i = low - 1;',
            '    for (int j = low; j < high; j++) {',
            '        // Compare with pivot',
            '        if (arr[j] < pivot) {',
            '            i++;',
            '            // Swap to left of pivot',
            '            swap(arr[i], arr[j]);',
            '        }',
            '    }',
            '    swap(arr[i+1], arr[high]);',
            '    return i + 1;',
            '}',
        ],
    },
    heap: {
        code: 'heapSort',
        lines: [
            'void heapSort(int arr[], int n) {',
            '    // Build max heap',
            '    for (int i = n/2 - 1; i >= 0; i--)',
            '        heapify(arr, n, i);',
            '    ',
            '    // Extract elements from heap',
            '    for (int i = n-1; i > 0; i--) {',
            '        // Move root to end',
            '        swap(arr[0], arr[i]);',
            '        heapify(arr, i, 0);',
            '    }',
            '}',
            '',
            'void heapify(int arr[], int n, int i) {',
            '    int largest = i;',
            '    int left = 2*i + 1;',
            '    int right = 2*i + 2;',
            '    // Compare with children',
            '    if (left < n && arr[left] > arr[largest])',
            '        largest = left;',
            '    if (right < n && arr[right] > arr[largest])',
            '        largest = right;',
            '    // Swap if needed',
            '    if (largest != i) {',
            '        swap(arr[i], arr[largest]);',
            '        heapify(arr, n, largest);',
            '    }',
            '}',
        ],
    },
};

// Map description patterns to line numbers
const getHighlightLine = (algorithm: string, description: string): number => {
    const desc = description.toLowerCase();

    if (algorithm === 'bubble') {
        if (desc.includes('comparing')) return 4;
        if (desc.includes('swapping')) return 6;
        if (desc.includes('sorted')) return 10;
    } else if (algorithm === 'selection') {
        if (desc.includes('finding minimum') || desc.includes('comparing')) return 5;
        if (desc.includes('swapping')) return 10;
        if (desc.includes('sorted')) return 12;
    } else if (algorithm === 'insertion') {
        if (desc.includes('inserting')) return 2;
        if (desc.includes('moving')) return 6;
        if (desc.includes('sorted')) return 12;
    } else if (algorithm === 'merge') {
        if (desc.includes('merging')) return 7;
        if (desc.includes('placing')) return 15;
        if (desc.includes('sorted')) return 7;
    } else if (algorithm === 'quick') {
        if (desc.includes('pivot')) return 10;
        if (desc.includes('comparing')) return 14;
        if (desc.includes('swapping')) return 17;
        if (desc.includes('placing pivot') || desc.includes('correct position')) return 20;
        if (desc.includes('sorted')) return 6;
    } else if (algorithm === 'heap') {
        if (desc.includes('heapifying') || desc.includes('comparing')) return 17;
        if (desc.includes('swapping')) return 24;
        if (desc.includes('moving max')) return 8;
        if (desc.includes('sorted')) return 10;
    }

    return 0;
};

export const CodeViewer: React.FC<CodeViewerProps> = ({
    algorithm,
    highlightLine,
    highlightType = 'comparing'
}) => {
    const codeData = ALGORITHM_CODE[algorithm];

    if (!codeData) return null;

    return (
        <div className="code-viewer">
            <div className="code-header">
                <span className="code-icon">📝</span>
                <span className="code-title">Algorithm Code</span>
                <span className="code-lang">C++</span>
            </div>
            <pre className="code-content">
                <code>
                    {codeData.lines.map((line, index) => {
                        const isHighlighted = highlightLine === index;
                        return (
                            <div
                                key={index}
                                className={`code-line ${isHighlighted ? `highlighted ${highlightType}` : ''}`}
                            >
                                <span className="line-number">{index + 1}</span>
                                <span className="line-content">{line || ' '}</span>
                                {isHighlighted && <span className="line-indicator">◀</span>}
                            </div>
                        );
                    })}
                </code>
            </pre>
        </div>
    );
};

// Export helper for getting highlight line
export { getHighlightLine };
