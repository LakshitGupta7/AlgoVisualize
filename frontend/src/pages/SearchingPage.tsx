import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { SearchingStep } from '../types';
import { SearchingVisualizer } from '../visualizers/SearchingVisualizer';
import { Controls } from '../components/Controls';
import { CodeViewer } from '../components/CodeViewer';
import { getSearchHighlightLine } from '../utils/searchHighlight';
import { useVisualization } from '../hooks/useVisualization';
import { API_BASE_URL } from '../config';
import './SearchingPage.css';

const ALGORITHMS = [
    { id: 'linear', name: 'Linear Search', complexity: 'O(n)', space: 'O(1)' },
    { id: 'binary', name: 'Binary Search', complexity: 'O(log n)', space: 'O(1)' },
    { id: 'jump', name: 'Jump Search', complexity: 'O(√n)', space: 'O(1)' },
    { id: 'interpolation', name: 'Interpolation Search', complexity: 'O(log log n)', space: 'O(1)' },
    { id: 'exponential', name: 'Exponential Search', complexity: 'O(log n)', space: 'O(1)' },
];

export const SearchingPage: React.FC = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear');
    const [inputArray, setInputArray] = useState('10, 20, 30, 40, 50, 60, 70, 80, 90, 100');
    const [targetValue, setTargetValue] = useState('70');
    const [steps, setSteps] = useState<SearchingStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundInfo, setFoundInfo] = useState<{ found: boolean; at?: number } | null>(null);

    const {
        currentStep, isPlaying, playSpeed, totalSteps, currentStepData, progress,
        play, pause, reset, stepForward, stepBackward, goToStep, setPlaySpeed,
    } = useVisualization<SearchingStep>({ steps, speed: 50 });

    const parseArray = (input: string): number[] => {
        return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    };

    const generateRandomArray = () => {
        const size = Math.floor(Math.random() * 12) + 8;
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 199) + 1);
        // Search usually needs sorted array except linear, so let's keep it sorted for consistency
        arr.sort((a, b) => a - b);
        setInputArray(arr.join(', '));
        // Pick a random element from array to be the target often
        const randomTarget = Math.random() > 0.3 ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 200);
        setTargetValue(randomTarget.toString());
    };

    const runVisualization = useCallback(async () => {
        const array = parseArray(inputArray);
        const target = parseInt(targetValue);

        if (array.length === 0) {
            setError('Please enter a valid array of numbers');
            return;
        }
        if (isNaN(target)) {
            setError('Please enter a valid target number');
            return;
        }

        setIsLoading(true);
        setError(null);
        setFoundInfo(null);
        reset();

        try {
            const response = await fetch(`${API_BASE_URL}/api/searching/${selectedAlgorithm}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array, target }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.steps || !Array.isArray(data.steps)) {
                throw new Error('Invalid response: missing steps array');
            }

            // Transform backend response to ensure all fields exist
            // Convert null to undefined for proper optional field handling
            const transformedSteps: SearchingStep[] = data.steps.map((step: SearchingStep) => ({
                array: step.array || [],
                current: step.current ?? undefined,
                left: step.left ?? undefined,
                right: step.right ?? undefined,
                mid: step.mid ?? undefined,
                found: step.found || false,
                description: step.description || '',
            }));

            setSteps(transformedSteps);
            setFoundInfo({ found: data.found, at: data.found_at });
        } catch (err: unknown) {
            console.error('Backend error:', err);
            setError(err instanceof Error ? err.message : 'Could not connect to backend.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedAlgorithm, inputArray, targetValue, reset]);

    // Auto-run when algorithm changes
    useEffect(() => {
        runVisualization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAlgorithm]); // Only re-run when algorithm changes, not on every input change

    const maxValue = Math.max(...parseArray(inputArray), parseInt(targetValue) || 0, 100);
    const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgorithm);

    // Get current highlight line for code viewer
    const highlightLine = useMemo(() => {
        if (!currentStepData?.description) return undefined;
        return getSearchHighlightLine(selectedAlgorithm, currentStepData.description);
    }, [selectedAlgorithm, currentStepData?.description]);

    const highlightType = useMemo(() => {
        if (!currentStepData) return 'comparing';
        if (currentStepData.found) return 'sorted';
        if (currentStepData.mid !== undefined) return 'pivot';
        return 'comparing';
    }, [currentStepData]);

    return (
        <div className="page searching-page">
            <header className="page-header">
                <h1>Searching Algorithms</h1>
                <p>Visualize how different searching algorithms locate values in an array</p>
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
                        <h3>Input Data</h3>
                        <div className="target-input-group">
                            <label>Target Value</label>
                            <input
                                type="number"
                                className="target-input"
                                value={targetValue}
                                onChange={(e) => setTargetValue(e.target.value)}
                            />
                        </div>
                        <div className="array-input-group">
                            <label>Array (comma separated)</label>
                            <textarea
                                className="input array-input"
                                value={inputArray}
                                onChange={(e) => setInputArray(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="input-actions">
                            <button className="btn btn-secondary" onClick={generateRandomArray}>
                                🎲 Random
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={runVisualization}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳ Loading...' : '▶️ Search'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>⚠️ Error</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {steps.length > 0 && foundInfo && (
                        <div className="stats-section">
                            <h3>Result</h3>
                            <div className="stat">
                                <span>Status</span>
                                <strong style={{ color: foundInfo.found ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    {foundInfo.found ? 'Found' : 'Not Found'}
                                </strong>
                            </div>
                            {foundInfo.found && (
                                <div className="stat">
                                    <span>Index</span>
                                    <strong>{foundInfo.at}</strong>
                                </div>
                            )}
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
                        </div>
                    )}
                    <div className="visualization-area">
                        <div className="viz-container">
                            {steps.length > 0 && currentStepData ? (
                                <SearchingVisualizer step={currentStepData} maxValue={maxValue} />
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">🔍</span>
                                    <h3>Ready to search!</h3>
                                    <p>Select an algorithm, enter your data, then click Search</p>
                                </div>
                            )}

                            {currentStepData?.found !== undefined && (
                                <div className={`found-status ${currentStepData.found ? 'status-found' : 'status-not-found'}`}>
                                    {currentStepData.found ? 'Found!' : 'Not Found'}
                                </div>
                            )}
                        </div>

                        {steps.length > 0 && (
                            <CodeViewer
                                algorithm={selectedAlgorithm}
                                highlightLine={highlightLine}
                                highlightType={highlightType as 'comparing' | 'swapping' | 'sorted' | 'pivot'}
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
        </div>
    );
};
