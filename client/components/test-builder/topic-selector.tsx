"use client";

import { motion } from "framer-motion";
import { CheckboxOption } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

interface TopicSelectorProps {
  topics: string[];
  selectedTopics: string[];
  onToggle: (topic: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function TopicSelector({
  topics,
  selectedTopics,
  onToggle,
  onSelectAll,
  onClearAll,
}: TopicSelectorProps) {
  const allSelected = selectedTopics.length === topics.length;
  const noneSelected = selectedTopics.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Topics</h3>
          <p className="text-sm text-muted-foreground">
            Choose one or more topics to include in your test
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={allSelected ? onClearAll : onSelectAll}
          >
            {allSelected ? "Clear all" : "Select all"}
          </Button>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          Please select a subject first
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="grid gap-3 sm:grid-cols-2"
        >
          {topics.map((topic) => (
            <motion.div key={topic} variants={staggerItemVariants}>
              <CheckboxOption
                id={`topic-${topic}`}
                label={topic}
                checked={selectedTopics.includes(topic)}
                onCheckedChange={() => onToggle(topic)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedTopics.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""}{" "}
          selected
        </p>
      )}
    </div>
  );
}
