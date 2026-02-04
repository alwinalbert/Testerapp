"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredQuestions: number;
  flaggedQuestions: number;
  onConfirmSubmit: () => Promise<void>;
}

export function SubmitDialog({
  open,
  onOpenChange,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onConfirmSubmit,
}: SubmitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unansweredCount = totalQuestions - answeredQuestions;
  const completionPercentage = (answeredQuestions / totalQuestions) * 100;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onConfirmSubmit();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {unansweredCount > 0 ? (
              <>
                <AlertTriangle className="h-5 w-5 text-warning" />
                Review Before Submitting
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-success" />
                Ready to Submit
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {unansweredCount > 0
              ? "You have some unanswered questions. Are you sure you want to submit?"
              : "All questions have been answered. Ready to submit your test?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Completion Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span className="font-medium">
                {answeredQuestions}/{totalQuestions} questions
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold text-success">{answeredQuestions}</p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </div>
            <div className="text-center rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold text-destructive">{unansweredCount}</p>
              <p className="text-xs text-muted-foreground">Unanswered</p>
            </div>
            <div className="text-center rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold text-warning">{flaggedQuestions}</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
          </div>

          {/* Warnings */}
          {unansweredCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-warning/50 bg-warning/10 p-3"
            >
              <p className="text-sm text-warning-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  You will receive 0 marks for {unansweredCount} unanswered{" "}
                  {unansweredCount === 1 ? "question" : "questions"}.
                </span>
              </p>
            </motion.div>
          )}

          {flaggedQuestions > 0 && (
            <p className="text-sm text-muted-foreground">
              You have {flaggedQuestions} flagged{" "}
              {flaggedQuestions === 1 ? "question" : "questions"} for review.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Continue Reviewing
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Test
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
