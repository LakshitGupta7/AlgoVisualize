import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVisualizationProps<T> {
    steps: T[];
    speed?: number;
}

export function useVisualization<T>({ steps, speed = 50 }: UseVisualizationProps<T>) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(speed);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Calculate delay from speed (5 = slow/2000ms, 100 = fast/50ms)
    const getDelay = useCallback((s: number) => {
        // Map 5-100 to 2000ms-50ms (inverse relationship)
        return Math.max(50, 2000 - (s * 20));
    }, []);

    const clearTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const scheduleNextStep = useCallback(() => {
        if (steps.length === 0) return;

        clearTimer();

        timeoutRef.current = setTimeout(() => {
            setCurrentStep((prev) => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, getDelay(playSpeed));
    }, [steps.length, playSpeed, getDelay, clearTimer]);

    // Re-schedule when speed changes during playback
    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            scheduleNextStep();
        }

        return clearTimer;
    }, [isPlaying, currentStep, scheduleNextStep, clearTimer, steps.length]);

    const play = useCallback(() => {
        if (steps.length === 0) return;
        if (currentStep >= steps.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(true);
    }, [steps.length, currentStep]);

    const pause = useCallback(() => {
        setIsPlaying(false);
        clearTimer();
    }, [clearTimer]);

    const reset = useCallback(() => {
        pause();
        setCurrentStep(0);
    }, [pause]);

    const stepForward = useCallback(() => {
        pause();
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, [steps.length, pause]);

    const stepBackward = useCallback(() => {
        pause();
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, [pause]);

    const goToStep = useCallback((step: number) => {
        pause();
        setCurrentStep(Math.min(Math.max(0, step), steps.length - 1));
    }, [steps.length, pause]);

    // Handle speed change - applies immediately
    const handleSpeedChange = useCallback((newSpeed: number) => {
        setPlaySpeed(newSpeed);
        // The useEffect will automatically reschedule with new speed
    }, []);

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
        setPlaySpeed: handleSpeedChange,
        progress: steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0,
    };
}
