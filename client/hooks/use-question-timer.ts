"use client";

import { useEffect, useRef, useState } from "react";

interface UseQuestionTimerOptions {
  /** Seconds allowed per question. 0 = disabled */
  limitSeconds: number;
  questionIndex: number;
  onTimeUp: () => void;
}

export function useQuestionTimer({
  limitSeconds,
  questionIndex,
  onTimeUp,
}: UseQuestionTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(limitSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const calledRef = useRef(false);

  // Reset timer when question changes
  useEffect(() => {
    if (limitSeconds <= 0) return;

    setSecondsLeft(limitSeconds);
    calledRef.current = false;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!calledRef.current) {
            calledRef.current = true;
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, limitSeconds]);

  const percentage = limitSeconds > 0 ? (secondsLeft / limitSeconds) * 100 : 100;
  const isLow = percentage <= 25;
  const isCritical = percentage <= 10;

  return { secondsLeft, percentage, isLow, isCritical, enabled: limitSeconds > 0 };
}
