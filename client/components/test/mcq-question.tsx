"use client";

import { motion } from "framer-motion";
import { RadioGroup } from "@/components/ui/radio-group";
import { TestQuestion, MCQOption } from "@/types";
import { cn } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface MCQQuestionProps {
  question: TestQuestion;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string, optionText: string) => void;
}

export function MCQQuestion({
  question,
  selectedOptionId,
  onSelect,
}: MCQQuestionProps) {
  const options = question.options || [];

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-3"
    >
      <RadioGroup
        value={selectedOptionId || ""}
        onValueChange={(value) => {
          const option = options.find((o) => o.id === value);
          if (option) {
            onSelect(option.id, option.text);
          }
        }}
        className="space-y-3"
      >
        {options.map((option, index) => (
          <motion.div key={option.id} variants={staggerItemVariants}>
            <MCQOptionButton
              option={option}
              index={index}
              isSelected={selectedOptionId === option.id}
              onSelect={() => onSelect(option.id, option.text)}
            />
          </motion.div>
        ))}
      </RadioGroup>
    </motion.div>
  );
}

interface MCQOptionButtonProps {
  option: MCQOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function MCQOptionButton({
  option,
  index,
  isSelected,
  onSelect,
}: MCQOptionButtonProps) {
  const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all",
        isSelected
          ? "border-primary/60 bg-primary/5"
          : "border-border/50 hover:border-border hover:bg-muted/30"
      )}
    >
      {/* Option letter indicator */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold transition-colors border-2",
          isSelected
            ? "bg-primary/10 border-primary text-primary"
            : "bg-background border-border text-muted-foreground"
        )}
      >
        {optionLabel}
      </div>

      {/* Option text */}
      <span className="flex-1 text-[15px] leading-relaxed">{option.text}</span>

      {/* Radio indicator */}
      <div
        className={cn(
          "h-5 w-5 shrink-0 rounded-full border-2 transition-all",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground"
        )}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-full w-full flex items-center justify-center"
          >
            <div className="h-2 w-2 rounded-full bg-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
