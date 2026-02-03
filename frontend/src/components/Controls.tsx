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
    return (
        <div className="controls">
            <div className="controls-main">
                <div className="controls-buttons">
                    <button className="control-btn" onClick={onReset} title="Reset">
                        ⏮️
                    </button>
                    <button className="control-btn" onClick={onStepBackward} title="Step Back">
                        ⏪
                    </button>
                    <button
                        className="control-btn control-btn-primary"
                        onClick={isPlaying ? onPause : onPlay}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button className="control-btn" onClick={onStepForward} title="Step Forward">
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
                        Step {currentStep + 1} / {totalSteps}
                    </span>
                </div>
            </div>

            <div className="controls-secondary">
                <div className="speed-control">
                    <label>Speed</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                        className="speed-slider"
                    />
                    <span className="speed-value">{speed}%</span>
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
