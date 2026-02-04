"use client";

import { motion } from "framer-motion";
import { SubjectCard } from "./subject-card";
import { Subject } from "@/types";
import { staggerContainerVariants } from "@/lib/animations";

interface SubjectGridProps {
  subjects: Subject[];
}

export function SubjectGrid({ subjects }: SubjectGridProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {subjects.map((subject, index) => (
        <SubjectCard key={subject.id} subject={subject} index={index} />
      ))}
    </motion.div>
  );
}
