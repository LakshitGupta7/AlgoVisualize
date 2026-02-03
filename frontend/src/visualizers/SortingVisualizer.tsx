import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { SortingStep } from '../types';
import './SortingVisualizer.css';

interface SortingVisualizerProps {
    step: SortingStep;
    maxValue: number;
}

interface BarPosition {
    value: number;
    originalIndex: number;
    translateX: number;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ step, maxValue }) => {
    const { array, comparing = [], swapping = [], sorted = [], pivot } = step;
    const prevArrayRef = useRef<number[]>([]);
    const [barPositions, setBarPositions] = useState<BarPosition[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate bar width
    const barWidth = useMemo(() => {
        const containerWidth = containerRef.current?.clientWidth || 800;
        const gap = 3;
        return Math.max((containerWidth - gap * (array.length - 1)) / array.length, 12);
    }, [array.length]);

    // Track positions and calculate translations for swap animation
    useEffect(() => {
        const prevArray = prevArrayRef.current;

        if (prevArray.length === array.length && swapping && swapping.length === 2) {
            // Find where each element moved
            const newPositions = array.map((value, newIndex) => {
                const oldIndex = prevArray.indexOf(value);
                const translateX = oldIndex !== -1 && oldIndex !== newIndex
                    ? (oldIndex - newIndex) * (barWidth + 3)
                    : 0;
                return { value, originalIndex: newIndex, translateX };
            });

            setBarPositions(newPositions);

            // Animate to final position
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setBarPositions(array.map((value, index) => ({
                        value,
                        originalIndex: index,
                        translateX: 0
                    })));
                }, 50);
            });
        } else {
            setBarPositions(array.map((value, index) => ({
                value,
                originalIndex: index,
                translateX: 0
            })));
        }

        prevArrayRef.current = [...array];
    }, [array, swapping, barWidth]);

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
            const position = barPositions[index];
            const translateX = position?.translateX || 0;

            return { value, height, className, index, translateX };
        });
    }, [array, comparing, swapping, sorted, pivot, maxValue, barPositions]);

    return (
        <div className="sorting-visualizer">
            <div className="bars-container" ref={containerRef}>
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className={bar.className}
                        style={{
                            height: `${bar.height}%`,
                            width: `${Math.max(100 / array.length - 0.5, 3)}%`,
                            transform: `translateX(${bar.translateX}px)`,
                            transition: bar.translateX !== 0
                                ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.15s ease'
                                : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                        }}
                    >
                        {array.length <= 25 && (
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
