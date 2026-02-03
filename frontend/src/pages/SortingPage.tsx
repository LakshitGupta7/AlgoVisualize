import React, { useState, useCallback } from 'react';
import type { SortingStep } from '../types';
import { SortingVisualizer } from '../visualizers/SortingVisualizer';
import { Controls } from '../components/Controls';
import { useVisualization } from '../hooks/useVisualization';
import { apiService } from '../services/api';
import './SortingPage.css';

const ALGORITHMS = [
    { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)' },
    { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)' },
    { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)' },
    { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' },
    { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
    { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)' },
    { id: 'counting', name: 'Counting Sort', complexity: 'O(n+k)' },
    { id: 'radix', name: 'Radix Sort', complexity: 'O(nk)' },
];

export const SortingPage: React.FC = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
    const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90, 45');
    const [steps, setSteps] = useState<SortingStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

    const {
        currentStep, isPlaying, playSpeed, totalSteps, currentStepData, progress,
        play, pause, reset, stepForward, stepBackward, goToStep, setPlaySpeed,
    } = useVisualization<SortingStep>({ steps, speed: 50 });

    const parseArray = (input: string): number[] => {
        return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    };

    const generateRandomArray = () => {
        const size = Math.floor(Math.random() * 15) + 8;
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        setInputArray(arr.join(', '));
    };

    const runVisualization = useCallback(async () => {
        const array = parseArray(inputArray);
        if (array.length === 0) return;

        setIsLoading(true);
        reset();
        try {
            const response = await apiService.executeSorting(selectedAlgorithm, array);
            setSteps(response.steps);
            setStats({ comparisons: response.total_comparisons, swaps: response.total_swaps });
        } catch (error) {
            console.error('Error:', error);
            // Fallback: generate local steps for demo
            const demoSteps: SortingStep[] = [
                { array: array, sorted: [], description: 'Initial array' },
                ...array.map((_, i) => ({
                    array: [...array].sort((a, b) => a - b).slice(0, i + 1).concat(array.slice(i + 1)),
                    comparing: [i, i + 1],
                    sorted: Array.from({ length: i }, (_, j) => j),
                    description: `Sorting step ${i + 1}`,
                })),
                { array: [...array].sort((a, b) => a - b), sorted: array.map((_, i) => i), description: 'Sorted!' },
            ];
            setSteps(demoSteps);
        } finally {
            setIsLoading(false);
        }
    }, [selectedAlgorithm, inputArray, reset]);

    const maxValue = Math.max(...parseArray(inputArray), 100);

    return (
        <div className="page sorting-page">
            <header className="page-header">
                <h1>📊 Sorting Algorithms</h1>
                <p>Visualize how different sorting algorithms work step by step</p>
            </header>

            <div className="page-content">
                <aside className="sidebar glass-card">
                    <h3>Algorithm</h3>
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
                                {isLoading ? '⏳' : '▶️'} Visualize
                            </button>
                        </div>
                    </div>

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
                        </div>
                    )}
                </aside>

                <main className="main-content">
                    <div className="viz-container">
                        {steps.length > 0 && currentStepData ? (
                            <SortingVisualizer step={currentStepData} maxValue={maxValue} />
                        ) : (
                            <div className="empty-state">
                                <span className="empty-icon">📊</span>
                                <h3>Select an algorithm and click Visualize</h3>
                                <p>Enter your array or generate a random one to begin</p>
                            </div>
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
        </div>
    );
};
