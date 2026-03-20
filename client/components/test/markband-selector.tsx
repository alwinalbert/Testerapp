"use client";

import { motion } from "framer-motion";
import { TestQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface MarkbandSelectorProps {
  question: TestQuestion;
  selectedBand: number | null;
  onSelect: (band: number) => void;
}

export function MarkbandSelector({ question, selectedBand, onSelect }: MarkbandSelectorProps) {
  const descriptors = question.band_descriptors || [];
  const max = question.markband_max || 8;

  // Default descriptors if none provided
  const defaultDescriptors =
    max === 4
      ? [
          { band: 0, range: "0", descriptor: "No relevant content." },
          { band: 1, range: "1–2", descriptor: "Limited understanding; mostly generic responses." },
          { band: 2, range: "3–4", descriptor: "Adequate understanding; some specific detail." },
          { band: 3, range: "5–6", descriptor: "Good understanding; clear and organised." },
          { band: 4, range: "7–8", descriptor: "Excellent; thorough, detailed, well-structured." },
        ]
      : [
          { band: 0, range: "0", descriptor: "No relevant content." },
          { band: 1, range: "1–2", descriptor: "Limited understanding." },
          { band: 2, range: "3–4", descriptor: "Basic understanding with some relevant content." },
          { band: 3, range: "5–6", descriptor: "Satisfactory; reasonable understanding demonstrated." },
          { band: 4, range: "7–8", descriptor: "Good; clear understanding with relevant detail." },
        ];

  const bands = descriptors.length > 0 ? descriptors : defaultDescriptors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <p className="text-sm font-medium">
        Select the markband that best describes your response:
      </p>
      <div className="space-y-2">
        {bands.map((b) => (
          <button
            key={b.band}
            type="button"
            onClick={() => onSelect(b.band)}
            className={cn(
              "w-full text-left rounded-lg border px-4 py-3 transition-all",
              "hover:border-primary/50 hover:bg-muted/40",
              selectedBand === b.band &&
                "border-primary bg-primary/5 ring-2 ring-primary/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 text-center min-w-[48px]">
                <span className="font-bold text-sm">{b.range}</span>
                <p className="text-[10px] text-muted-foreground">marks</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.descriptor}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        IB markband scoring — select the band that most closely matches your answer.
      </p>
    </motion.div>
  );
}
