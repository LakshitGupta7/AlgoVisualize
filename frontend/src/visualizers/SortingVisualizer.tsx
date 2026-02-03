import React, { useMemo } from 'react';
import type { SortingStep } from '../types';
import './SortingVisualizer.css';

interface SortingVisualizerProps {
    step: SortingStep;
    maxValue: number;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ step, maxValue }) => {
    const { array, comparing = [], swapping = [], sorted = [], pivot } = step;

    const bars = useMemo(() => {
        return array.map((value, index) => {
            let className = 'viz-bar';

            if (sorted.includes(index)) {
                className += ' sorted';
            } else if (swapping?.includes(index)) {
                className += ' swapping';
            } else if (comparing?.includes(index)) {
                className += ' comparing';
            }

            if (pivot === index) {
                className += ' pivot';
            }

            const height = (value / maxValue) * 100;

            return { value, height, className, index };
        });
    }, [array, comparing, swapping, sorted, pivot, maxValue]);

    return (
        <div className="sorting-visualizer">
            <div className="bars-container">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className={bar.className}
                        style={{
                            height: `${bar.height}%`,
                            width: `${Math.max(100 / array.length - 1, 2)}%`,
                        }}
                    >
                        {array.length <= 20 && (
                            <span className="bar-value">{bar.value}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color comparing"></div>
                    <span>Comparing</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color swapping"></div>
                    <span>Swapping</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color sorted"></div>
                    <span>Sorted</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color pivot"></div>
                    <span>Pivot</span>
                </div>
            </div>
        </div>
    );
};
