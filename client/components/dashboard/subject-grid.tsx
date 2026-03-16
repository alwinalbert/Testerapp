"use client";

import { motion } from "framer-motion";
import { SubjectCard } from "./subject-card";
import { Subject } from "@/types";
import { staggerContainerVariants } from "@/lib/animations";
import type { SubjectStat } from "@/lib/test-storage";

interface SubjectGridProps {
  subjects: Subject[];
  subjectStats?: SubjectStat[];
}

export function SubjectGrid({ subjects, subjectStats = [] }: SubjectGridProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {subjects.map((subject, index) => {
        const stat = subjectStats.find(
          (s) => s.subjectName.toLowerCase() === subject.name.toLowerCase()
        );
        return (
          <SubjectCard
            key={subject.id}
            subject={subject}
            index={index}
            predictedGrade={stat?.predictedGrade}
            lastScore={stat?.lastScore}
            trend={stat?.trend}
            isPriority={stat?.isPriority}
          />
        );
      })}
    </motion.div>
  );
}
