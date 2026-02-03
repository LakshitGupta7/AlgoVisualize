import React, { useMemo, useRef } from 'react';
import type { SearchingStep } from '../types';
import './SearchingVisualizer.css';

interface SearchingVisualizerProps {
    step: SearchingStep;
    maxValue: number;
}

export const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ step, maxValue }) => {
    const { array, current, left, right, mid, found } = step;
    const containerRef = useRef<HTMLDivElement>(null);

    const bars = useMemo(() => {
        return array.map((value, index) => {
            let className = 'viz-bar';
            let isDimmed = false;

            // Handle binary/jump search boundaries
            if (left !== undefined && right !== undefined) {
                if (index < left || index > right) {
                    isDimmed = true;
                }
            }

            if (index === current) {
                className += ' active';
                if (found) className += ' found';
            }

            if (index === left || index === right) {
                className += ' boundary';
            }

            if (index === mid) {
                className += ' mid';
                if (found) className += ' found';
            }

            if (isDimmed) {
                className += ' dimmed';
            }

            // Cap height at 85% to leave room for scaling animations
            const height = Math.min((value / maxValue) * 100, 85);

            return { value, height, className, index };
        });
    }, [array, current, left, right, mid, found, maxValue]);

    const renderPointer = (index: number | undefined, label: string, type: string) => {
        if (index === undefined) return null;

        const widthPercent = 100 / array.length;
        const leftPosition = (index * widthPercent) + (widthPercent / 2);

        return (
            <div
                key={`${type}-${index}`}
                className={`pointer ${type}`}
                style={{ left: `${leftPosition}%`, transform: 'translateX(-50%)' }}
            >
                <span className="pointer-arrow">▲</span>
                <span className="pointer-label">{label}</span>
            </div>
        );
    };

    return (
        <div className="searching-visualizer">
            <div className="bars-container" ref={containerRef}>
                {bars.map((bar) => (
                    <div
                        key={bar.index}
                        className={bar.className}
                        style={{
                            height: `${Math.max(bar.height, 8)}%`,
                            width: `${Math.max(100 / array.length - 1, 3)}%`,
                        }}
                    >
                        {array.length <= 20 && (
                            <span className="bar-value">{bar.value}</span>
                        )}
                    </div>
                ))}

                {/* Pointers */}
                {renderPointer(left, 'L', 'left')}
                {renderPointer(right, 'R', 'right')}
                {renderPointer(mid, 'M', 'mid')}
                {renderPointer(current, '▲', 'current')}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color current"></div>
                    <span>Current</span>
                </div>
                {(left !== undefined || right !== undefined) && (
                    <div className="legend-item">
                        <div className="legend-color boundary"></div>
                        <span>Boundary (L/R)</span>
                    </div>
                )}
                {mid !== undefined && (
                    <div className="legend-item">
                        <div className="legend-color mid"></div>
                        <span>Middle</span>
                    </div>
                )}
                <div className="legend-item">
                    <div className="legend-color found"></div>
                    <span>Found</span>
                </div>
            </div>
        </div>
    );
};
