"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { formatTime } from "@/lib/utils";

interface UseTimerOptions {
  durationMinutes: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

interface UseTimerReturn {
  /** Time remaining in seconds */
  timeRemaining: number;
  /** Formatted time string (MM:SS) */
  formattedTime: string;
  /** Whether the timer is running */
  isRunning: boolean;
  /** Whether time is low (< 5 minutes) */
  isLowTime: boolean;
  /** Whether time is critical (< 1 minute) */
  isCriticalTime: boolean;
  /** Percentage of time remaining */
  percentageRemaining: number;
  /** Start the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Resume the timer */
  resume: () => void;
  /** Reset the timer */
  reset: () => void;
}

export function useTimer({
  durationMinutes,
  onTimeUp,
  autoStart = true,
}: UseTimerOptions): UseTimerReturn {
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [timeRemaining]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(totalSeconds);
  }, [totalSeconds]);

  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isCriticalTime = timeRemaining < 60; // Less than 1 minute
  const percentageRemaining = (timeRemaining / totalSeconds) * 100;

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    isLowTime,
    isCriticalTime,
    percentageRemaining,
    start,
    pause,
    resume,
    reset,
  };
}
