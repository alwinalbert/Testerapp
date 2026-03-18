"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TestQuestion, LabelPosition } from "@/types";

interface LabelDiagramQuestionProps {
  question: TestQuestion;
  answers: Record<string, string>;
  onAnswerChange: (answers: Record<string, string>) => void;
}

export function LabelDiagramQuestion({ question, answers, onAnswerChange }: LabelDiagramQuestionProps) {
  const { image_url, image_alt, label_positions = [] } = question;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    onAnswerChange({ ...answers, [id]: value });
  };

  if (!image_url) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Diagram not available — label the parts listed below.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Diagram with numbered hotspots */}
      <div className="relative rounded-lg border overflow-hidden bg-muted/20 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image_url}
          alt={image_alt || "Diagram to label"}
          className="w-full max-h-80 object-contain"
          draggable={false}
        />

        {label_positions.map((pos, index) => (
          <button
            key={pos.id}
            type="button"
            onMouseEnter={() => setHoveredId(pos.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all z-10 ${
              answers[pos.id]
                ? "border-green-500 bg-green-500 text-white"
                : hoveredId === pos.id
                ? "border-primary bg-primary text-primary-foreground scale-110"
                : "border-primary bg-background text-primary"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Label inputs */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Label each numbered part
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {label_positions.map((pos, index) => (
            <div key={pos.id} className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full font-bold border-primary text-primary"
              >
                {index + 1}
              </Badge>
              <Input
                placeholder={pos.hint || `Label ${index + 1}`}
                value={answers[pos.id] || ""}
                onChange={(e) => handleChange(pos.id, e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <p className="text-xs text-muted-foreground">
        {Object.values(answers).filter(Boolean).length} / {label_positions.length} labels filled
      </p>
    </div>
  );
}
