"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function NavigationButtons({
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Previous Button */}
      <motion.div whileHover={{ x: -2 }} whileTap={{ x: -4 }}>
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      </motion.div>

      {/* Next / Submit Button */}
      <motion.div whileHover={{ x: 2 }} whileTap={{ x: 4 }}>
        {isLastQuestion ? (
          <Button onClick={onSubmit} className="gap-2" size="lg">
            Submit Test
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </div>
  );
}

// Floating navigation for mobile
export function FloatingNavigation({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur p-2 shadow-lg md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="h-10 w-10 rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="h-6 w-px bg-border" />
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
        className="h-10 w-10 rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
