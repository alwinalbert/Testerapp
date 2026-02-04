"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Subject, DashboardFilters, QuestionType, Difficulty } from "@/types";

interface FiltersProps {
  subjects: Subject[];
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Filters({
  subjects,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Get topics for selected subject
  const selectedSubject = subjects.find((s) => s.id === filters.subject);
  const topics = selectedSubject?.topics || [];

  // Count active filters
  const activeFilterCount = [
    filters.subject,
    filters.topic,
    filters.questionType,
    filters.difficulty,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange("");
  };

  const updateFilter = <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K] | undefined
  ) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    // Clear topic if subject changes
    if (key === "subject") {
      delete newFilters.topic;
    }
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search subjects or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Filter Options</span>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto py-1 px-2 text-xs text-muted-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Subject Filter */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Subject</label>
                  <Select
                    value={filters.subject || ""}
                    onValueChange={(value) =>
                      updateFilter("subject", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Filter */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Topic</label>
                  <Select
                    value={filters.topic || ""}
                    onValueChange={(value) =>
                      updateFilter("topic", value || undefined)
                    }
                    disabled={!filters.subject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All topics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All topics</SelectItem>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Type Filter */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Question Type
                  </label>
                  <Select
                    value={filters.questionType || ""}
                    onValueChange={(value) =>
                      updateFilter("questionType", (value as QuestionType) || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="written">Written</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Difficulty
                  </label>
                  <Select
                    value={filters.difficulty || ""}
                    onValueChange={(value) =>
                      updateFilter("difficulty", (value as Difficulty) || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.subject && (
            <Badge variant="secondary" className="gap-1">
              {subjects.find((s) => s.id === filters.subject)?.name}
              <button
                onClick={() => updateFilter("subject", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.topic && (
            <Badge variant="secondary" className="gap-1">
              {filters.topic}
              <button
                onClick={() => updateFilter("topic", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.questionType && (
            <Badge variant="secondary" className="gap-1">
              {filters.questionType}
              <button
                onClick={() => updateFilter("questionType", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="secondary" className="gap-1">
              {filters.difficulty}
              <button
                onClick={() => updateFilter("difficulty", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
