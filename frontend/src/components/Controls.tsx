import React from 'react';
import './Controls.css';

interface ControlsProps {
    isPlaying: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
    progress: number;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onSpeedChange: (speed: number) => void;
    onProgressChange: (step: number) => void;
    description?: string;
}

export const Controls: React.FC<ControlsProps> = ({
    isPlaying,
    currentStep,
    totalSteps,
    speed,
    progress,
    onPlay,
    onPause,
    onReset,
    onStepForward,
    onStepBackward,
    onSpeedChange,
    onProgressChange,
    description,
}) => {
    // Convert speed percentage to readable label
    const getSpeedLabel = (s: number) => {
        if (s <= 20) return '0.25x';
        if (s <= 40) return '0.5x';
        if (s <= 60) return '1x';
        if (s <= 80) return '2x';
        return '4x';
    };

    return (
        <div className="controls">
            <div className="controls-main">
                <div className="controls-buttons">
                    <button className="control-btn" onClick={onReset} title="Reset to Start">
                        ⏮️
                    </button>
                    <button
                        className="control-btn"
                        onClick={onStepBackward}
                        title="Previous Step"
                        disabled={currentStep === 0}
                    >
                        ⏪
                    </button>
                    <button
                        className={`control-btn control-btn-primary ${isPlaying ? 'playing' : ''}`}
                        onClick={isPlaying ? onPause : onPlay}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button
                        className="control-btn"
                        onClick={onStepForward}
                        title="Next Step"
                        disabled={currentStep >= totalSteps - 1}
                    >
                        ⏩
                    </button>
                </div>

                <div className="controls-progress">
                    <input
                        type="range"
                        min="0"
                        max={totalSteps - 1}
                        value={currentStep}
                        onChange={(e) => onProgressChange(parseInt(e.target.value))}
                        className="progress-slider"
                    />
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="controls-info">
                    <span className="step-counter">
                        {currentStep + 1} <span className="step-divider">/</span> {totalSteps}
                    </span>
                </div>
            </div>

            <div className="controls-secondary">
                <div className="speed-control">
                    <span className="speed-label">🐢</span>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                        className="speed-slider"
                    />
                    <span className="speed-label">🐇</span>
                    <span className="speed-value">{getSpeedLabel(speed)}</span>
                </div>
            </div>

            {description && (
                <div className="controls-description">
                    <span className="description-icon">💡</span>
                    <p>{description}</p>
                </div>
            )}
        </div>
    );
};
