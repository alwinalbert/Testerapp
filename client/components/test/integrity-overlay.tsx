"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntegrityWarningProps {
  message: string | null;
  isPaused: boolean;
  tabSwitchCount: number;
  onDismiss: () => void;
  onRequestFullScreen: () => void;
}

export function IntegrityOverlay({
  message,
  isPaused,
  tabSwitchCount,
  onDismiss,
  onRequestFullScreen,
}: IntegrityWarningProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="mx-4 max-w-md w-full rounded-2xl border border-destructive/40 bg-background shadow-2xl p-6 space-y-4"
          >
            {/* Icon */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Integrity Alert</h3>
                {tabSwitchCount > 0 && (
                  <p className="text-xs text-muted-foreground">Tab switch #{tabSwitchCount}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <p className="text-sm leading-relaxed">{message}</p>

            {/* Actions */}
            <div className="flex gap-3">
              {isPaused ? (
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    onRequestFullScreen();
                    onDismiss();
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                  Re-enter Full-Screen
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={onDismiss}>
                  I understand — continue test
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface QuestionTimerBarProps {
  secondsLeft: number;
  percentage: number;
  isLow: boolean;
  isCritical: boolean;
}

export function QuestionTimerBar({ secondsLeft, percentage, isLow, isCritical }: QuestionTimerBarProps) {
  const barColor = isCritical
    ? "bg-destructive"
    : isLow
    ? "bg-warning"
    : "bg-primary";

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = mins > 0
    ? `${mins}:${String(secs).padStart(2, "0")}`
    : `${secs}s`;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b">
      <span className="text-xs text-muted-foreground shrink-0">Time for this question</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${barColor}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className={`text-xs font-mono font-bold shrink-0 ${isCritical ? "text-destructive" : isLow ? "text-warning" : ""}`}>
        {display}
      </span>
    </div>
  );
}
