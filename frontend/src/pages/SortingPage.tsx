import React, { useState, useCallback, useMemo } from 'react';
import type { SortingStep } from '../types';
import { SortingVisualizer } from '../visualizers/SortingVisualizer';
import { Controls } from '../components/Controls';
import { CodeViewer } from '../components/CodeViewer';
import { getHighlightLine } from '../utils/codeHighlight';
import { useVisualization } from '../hooks/useVisualization';
import { API_BASE_URL } from '../config';
import './SortingPage.css';
import CodeModal from './CodeModal';

const ALGORITHMS = [
    { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', space: 'O(1)' },
    { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)', space: 'O(1)' },
    { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', space: 'O(1)' },
    { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)', space: 'O(n)' },
    { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)', space: 'O(log n)' },
    { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)', space: 'O(1)' },
];

export const SortingPage: React.FC = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
    const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90, 45');
    const [steps, setSteps] = useState<SortingStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
    const [error, setError] = useState<string | null>(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    const sortingCode = {
        'Bubble Sort': `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
        'Selection Sort': `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
        'Insertion Sort': `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}`,
        'Merge Sort': `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    // Merge two halves...
}`,
        'Quick Sort': `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
        'Heap Sort': `void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
    };

    const {
        currentStep, isPlaying, playSpeed, totalSteps, currentStepData, progress,
        play, pause, reset, stepForward, stepBackward, goToStep, setPlaySpeed,
    } = useVisualization<SortingStep>({ steps, speed: 50 });

    const parseArray = (input: string): number[] => {
        return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    };

    const generateRandomArray = () => {
        const size = Math.floor(Math.random() * 10) + 8;
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
        setInputArray(arr.join(', '));
    };

    const runVisualization = useCallback(async () => {
        const array = parseArray(inputArray);
        if (array.length === 0) return;

        setIsLoading(true);
        setError(null);
        reset();

        try {
            // Call Python FastAPI backend
            const response = await fetch(`${API_BASE_URL}/api/sorting/${selectedAlgorithm}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ array }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.steps || !Array.isArray(data.steps)) {
                throw new Error('Invalid response format from server');
            }

            // Transform backend response to frontend format
            const transformedSteps: SortingStep[] = data.steps.map((step: SortingStep) => ({
                array: step.array,
                comparing: step.comparing || [],
                swapping: step.swapping || [],
                sorted: step.sorted || [],
                pivot: step.pivot,
                description: step.description,
            }));

            setSteps(transformedSteps);
            setStats({
                comparisons: data.total_comparisons || 0,
                swaps: data.total_swaps || 0,
            });
        } catch (err: unknown) {
            console.error('Backend error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Make sure the Python server is running on port 8000.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedAlgorithm, inputArray, reset]);

    const maxValue = Math.max(...parseArray(inputArray), 100);
    const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgorithm);

    // Get current highlight line for code viewer
    const highlightLine = useMemo(() => {
        if (!currentStepData?.description) return undefined;
        return getHighlightLine(selectedAlgorithm, currentStepData.description);
    }, [selectedAlgorithm, currentStepData?.description]);

    // Determine highlight type from current step
    const highlightType = useMemo(() => {
        if (!currentStepData) return 'comparing';
        if (currentStepData.swapping && currentStepData.swapping.length > 0) return 'swapping';
        if (currentStepData.sorted && currentStepData.sorted.length === currentStepData.array.length) return 'sorted';
        if (currentStepData.pivot !== undefined) return 'pivot';
        return 'comparing';
    }, [currentStepData]);

    return (
        <div className="page sorting-page">
            <header className="page-header">
                <h1>Sorting Algorithms</h1>
                <p>Visualize how different sorting algorithms work step by step</p>
                <button className="view-code-main" onClick={() => setIsCodeModalOpen(true)}>
                    <span className="btn-icon">💻</span>
                    View Implementation
                </button>
            </header>

            <div className="page-content">
                <aside className="sidebar glass-card">
                    <h3>Select Algorithm</h3>
                    <div className="algorithm-list">
                        {ALGORITHMS.map((algo) => (
                            <button
                                key={algo.id}
                                className={`algorithm-btn ${selectedAlgorithm === algo.id ? 'active' : ''}`}
                                onClick={() => setSelectedAlgorithm(algo.id)}
                            >
                                <span className="algo-name">{algo.name}</span>
                                <span className="algo-complexity">{algo.complexity}</span>
                            </button>
                        ))}
                    </div>

                    <div className="input-section">
                        <h3>Input Array</h3>
                        <textarea
                            className="input array-input"
                            value={inputArray}
                            onChange={(e) => setInputArray(e.target.value)}
                            placeholder="Enter numbers separated by commas"
                            rows={3}
                        />
                        <div className="input-actions">
                            <button className="btn btn-secondary" onClick={generateRandomArray}>
                                🎲 Random
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={runVisualization}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳ Loading...' : '▶️ Visualize'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <p>{error}</p>
                            <small>Run: <code>cd backend/fastapi && uvicorn main:app --reload</code></small>
                        </div>
                    )}

                    {steps.length > 0 && (
                        <div className="stats-section">
                            <h3>Statistics</h3>
                            <div className="stat">
                                <span>Comparisons</span>
                                <strong>{stats.comparisons}</strong>
                            </div>
                            <div className="stat">
                                <span>Swaps</span>
                                <strong>{stats.swaps}</strong>
                            </div>
                            <div className="stat">
                                <span>Total Steps</span>
                                <strong>{totalSteps}</strong>
                            </div>
                        </div>
                    )}
                </aside>

                <main className="main-content">
                    {currentAlgo && steps.length > 0 && (
                        <div className="algo-info">
                            <div className="algo-info-item">
                                <span className="algo-info-label">Time</span>
                                <span className="algo-info-value">{currentAlgo.complexity}</span>
                            </div>
                            <div className="algo-info-item">
                                <span className="algo-info-label">Space</span>
                                <span className="algo-info-value">{currentAlgo.space}</span>
                            </div>
                            <div className="algo-info-item">
                                <span className="algo-info-label">Elements</span>
                                <span className="algo-info-value">{parseArray(inputArray).length}</span>
                            </div>
                        </div>
                    )}

                    <div className="visualization-area">
                        <div className="viz-container">
                            {steps.length > 0 && currentStepData ? (
                                <SortingVisualizer step={currentStepData} maxValue={maxValue} />
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">📊</span>
                                    <h3>Ready to visualize!</h3>
                                    <p>Select an algorithm, enter your array or generate a random one, then click Visualize</p>
                                    {!error && (
                                        <small style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                                            ⚡ Powered by Python FastAPI Backend
                                        </small>
                                    )}
                                </div>
                            )}
                        </div>

                        {steps.length > 0 && (
                            <CodeViewer
                                algorithm={selectedAlgorithm}
                                highlightLine={highlightLine}
                                highlightType={highlightType}
                            />
                        )}
                    </div>

                    {steps.length > 0 && (
                        <Controls
                            isPlaying={isPlaying}
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            speed={playSpeed}
                            progress={progress}
                            onPlay={play}
                            onPause={pause}
                            onReset={reset}
                            onStepForward={stepForward}
                            onStepBackward={stepBackward}
                            onSpeedChange={setPlaySpeed}
                            onProgressChange={goToStep}
                            description={currentStepData?.description}
                        />
                    )}
                </main>
            </div>

            <CodeModal
                isOpen={isCodeModalOpen}
                onClose={() => setIsCodeModalOpen(false)}
                title="Sorting Algorithms Implementation"
                code={sortingCode}
            />
        </div>
    );
};
