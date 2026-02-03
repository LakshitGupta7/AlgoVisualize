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
    bucket: {
        code: 'bucketSort',
        lines: [
            'void bucketSort(float arr[], int n) {',
            '    // Create n empty buckets',
            '    vector<float> buckets[n];',
            '    // Put elements in buckets',
            '    for (int i = 0; i < n; i++) {',
            '        int idx = n * arr[i];',
            '        buckets[idx].push_back(arr[i]);',
            '    }',
            '    // Sort each bucket',
            '    for (int i = 0; i < n; i++) {',
            '        sort(buckets[i].begin(), buckets[i].end());',
            '    }',
            '    // Concatenate buckets',
            '    int index = 0;',
            '    for (int i = 0; i < n; i++) {',
            '        for (int j = 0; j < buckets[i].size(); j++) {',
            '            arr[index++] = buckets[i][j];',
            '        }',
            '    }',
            '}',
        ],
    },
    linear: {
        code: 'linearSearch',
        lines: [
            'int linearSearch(int arr[], int n, int x) {',
            '    for (int i = 0; i < n; i++) {',
            '        // Check each element',
            '        if (arr[i] == x) {',
            '            // Found at index i',
            '            return i;',
            '        }',
            '    }',
            '    // Not found',
            '    return -1;',
            '}',
        ],
    },
    binary: {
        code: 'binarySearch',
        lines: [
            'int binarySearch(int arr[], int l, int r, int x) {',
            '    while (l <= r) {',
            '        int m = l + (r - l) / 2;',
            '        // Check if x is at mid',
            '        if (arr[m] == x) {',
            '            return m;',
            '        }',
            '        // If x greater, ignore left half',
            '        if (arr[m] < x) {',
            '            l = m + 1;',
            '        }',
            '        // If x smaller, ignore right half',
            '        else {',
            '            r = m - 1;',
            '        }',
            '    }',
            '    return -1;',
            '}',
        ],
    },
    jump: {
        code: 'jumpSearch',
        lines: [
            'int jumpSearch(int arr[], int n, int x) {',
            '    int step = sqrt(n);',
            '    int prev = 0;',
            '    // Jump through blocks',
            '    while (arr[min(step, n)-1] < x) {',
            '        prev = step;',
            '        step += sqrt(n);',
            '        if (prev >= n) return -1;',
            '    }',
            '    // Linear search in block',
            '    while (arr[prev] < x) {',
            '        prev++;',
            '        if (prev == min(step, n)) return -1;',
            '    }',
            '    if (arr[prev] == x) return prev;',
            '    return -1;',
            '}',
        ],
    },
    interpolation: {
        code: 'interpolationSearch',
        lines: [
            'int interpolationSearch(int arr[], int n, int x) {',
            '    int low = 0, high = (n - 1);',
            '    while (low <= high && x >= arr[low] && x <= arr[high]) {',
            '        // Proportional position',
            '        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (x - arr[low]));',
            '        if (arr[pos] == x) return pos;',
            '        if (arr[pos] < x) low = pos + 1;',
            '        else high = pos - 1;',
            '    }',
            '    return -1;',
            '}',
        ],
    },
    exponential: {
        code: 'exponentialSearch',
        lines: [
            'int exponentialSearch(int arr[], int n, int x) {',
            '    if (arr[0] == x) return 0;',
            '    int i = 1;',
            '    // Find range for binary search',
            '    while (i < n && arr[i] <= x)',
            '        i = i * 2;',
            '    // Call binary search for range',
            '    return binarySearch(arr, i/2, min(i, n-1), x);',
            '}',
        ],
    },
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
