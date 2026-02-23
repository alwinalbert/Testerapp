"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { CheckboxOption } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [customInput, setCustomInput] = useState("");
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  const allTopics = [...topics, ...customTopics];
  const allSelected = allTopics.length > 0 && selectedTopics.length === allTopics.length;

  const addCustomTopic = () => {
    const trimmed = customInput.trim();
    if (!trimmed || allTopics.includes(trimmed)) return;
    setCustomTopics((prev) => [...prev, trimmed]);
    onToggle(trimmed); // auto-select newly added topic
    setCustomInput("");
  };

  const removeCustomTopic = (topic: string) => {
    setCustomTopics((prev) => prev.filter((t) => t !== topic));
    if (selectedTopics.includes(topic)) onToggle(topic);
  };

  const handleSelectAll = () => {
    // ensure custom topics are included when selecting all
    customTopics.forEach((t) => {
      if (!selectedTopics.includes(t)) onToggle(t);
    });
    onSelectAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Topics</h3>
          <p className="text-sm text-muted-foreground">
            Choose syllabus topics or add your own custom ones
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={allSelected ? onClearAll : handleSelectAll}
          disabled={allTopics.length === 0}
        >
          {allSelected ? "Clear all" : "Select all"}
        </Button>
      </div>

      {allTopics.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          Please select a subject first, or add a custom topic below
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

          {customTopics.map((topic) => (
            <motion.div
              key={`custom-${topic}`}
              variants={staggerItemVariants}
              className="flex items-center gap-2"
            >
              <div className="flex-1">
                <CheckboxOption
                  id={`topic-custom-${topic}`}
                  label={topic}
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={() => onToggle(topic)}
                />
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs gap-1 pr-1">
                Custom
                <button
                  onClick={() => removeCustomTopic(topic)}
                  className="ml-0.5 rounded-full hover:text-destructive transition-colors"
                  aria-label={`Remove ${topic}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Custom topic input */}
      <div className="flex gap-2 pt-1">
        <Input
          placeholder="Add a custom topic (e.g. Organic Chemistry — Benzene)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={addCustomTopic}
          disabled={!customInput.trim()}
          className="gap-1 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {selectedTopics.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected
          {customTopics.length > 0 && (
            <span className="ml-1 text-primary">
              ({customTopics.filter((t) => selectedTopics.includes(t)).length} custom)
            </span>
          )}
        </p>
      )}
    </div>
  );
}
