import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVisualizationProps<T> {
    steps: T[];
    speed?: number;
}

export function useVisualization<T>({ steps, speed = 500 }: UseVisualizationProps<T>) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(speed);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const play = useCallback(() => {
        if (steps.length === 0) return;
        setIsPlaying(true);
    }, [steps.length]);

    const pause = useCallback(() => {
        setIsPlaying(false);
        clearTimer();
    }, [clearTimer]);

    const reset = useCallback(() => {
        pause();
        setCurrentStep(0);
    }, [pause]);

    const stepForward = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, [steps.length]);

    const stepBackward = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback((step: number) => {
        setCurrentStep(Math.min(Math.max(0, step), steps.length - 1));
    }, [steps.length]);

    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        clearTimer();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000 - (playSpeed * 9)); // Convert 0-100 to delay
        } else {
            clearTimer();
        }

        return clearTimer;
    }, [isPlaying, playSpeed, steps.length, clearTimer]);

    return {
        currentStep,
        isPlaying,
        playSpeed,
        totalSteps: steps.length,
        currentStepData: steps[currentStep],
        play,
        pause,
        reset,
        stepForward,
        stepBackward,
        goToStep,
        setPlaySpeed,
        progress: steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0,
    };
}
