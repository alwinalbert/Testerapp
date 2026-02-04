"use client";

import { motion } from "framer-motion";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { timerPulseVariants } from "@/lib/animations";

interface TestTimerProps {
  formattedTime: string;
  isRunning: boolean;
  isLowTime: boolean;
  isCriticalTime: boolean;
  percentageRemaining: number;
  onPause?: () => void;
  onResume?: () => void;
  showControls?: boolean;
}

export function TestTimer({
  formattedTime,
  isRunning,
  isLowTime,
  isCriticalTime,
  percentageRemaining,
  onPause,
  onResume,
  showControls = false,
}: TestTimerProps) {
  const animationState = isCriticalTime
    ? "critical"
    : isLowTime
    ? "warning"
    : "normal";

  return (
    <motion.div
      variants={timerPulseVariants}
      animate={animationState}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-2 transition-colors",
        isCriticalTime
          ? "border-destructive bg-destructive/10"
          : isLowTime
          ? "border-warning bg-warning/10"
          : "border-border bg-card"
      )}
    >
      <Clock
        className={cn(
          "h-5 w-5",
          isCriticalTime
            ? "text-destructive"
            : isLowTime
            ? "text-warning"
            : "text-muted-foreground"
        )}
      />

      <div className="flex flex-col">
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            isCriticalTime
              ? "text-destructive"
              : isLowTime
              ? "text-warning"
              : "text-foreground"
          )}
        >
          {formattedTime}
        </span>
        {(isLowTime || isCriticalTime) && (
          <span className="text-xs text-muted-foreground">
            {isCriticalTime ? "Time almost up!" : "Less than 5 minutes"}
          </span>
        )}
      </div>

      {showControls && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-2"
          onClick={isRunning ? onPause : onResume}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}
    </motion.div>
  );
}

// Compact timer for mobile
export function CompactTimer({
  formattedTime,
  isLowTime,
  isCriticalTime,
}: {
  formattedTime: string;
  isLowTime: boolean;
  isCriticalTime: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        isCriticalTime
          ? "bg-destructive text-destructive-foreground"
          : isLowTime
          ? "bg-warning text-warning-foreground"
          : "bg-muted text-muted-foreground"
      )}
    >
      <Clock className="h-3 w-3" />
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  );
}
