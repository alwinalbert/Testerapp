"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { computeStats, getTestResults } from "@/lib/test-storage";
import { pageVariants } from "@/lib/animations";

interface Flashcard { front: string; back: string }

const FLASHCARD_BANK: Record<string, Flashcard[]> = {
  "Algebra & Functions": [
    { front: "What is the quadratic formula?", back: "x = (−b ± √(b²−4ac)) / 2a\nUsed to solve ax² + bx + c = 0" },
    { front: "What does it mean for a function to be one-to-one?", back: "Every input maps to a unique output. No two inputs share the same output (injective)." },
    { front: "How do you find the inverse of a function?", back: "1. Replace f(x) with y\n2. Swap x and y\n3. Solve for y\n4. Write as f⁻¹(x)" },
    { front: "What is the domain of f(x) = √x?", back: "x ≥ 0, i.e., the domain is [0, ∞)" },
    { front: "Factor: x² − 5x + 6", back: "(x − 2)(x − 3)\nRoots: x = 2 and x = 3" },
  ],
  "Calculus": [
    { front: "What is the derivative of xⁿ?", back: "d/dx (xⁿ) = nxⁿ⁻¹\nMultiply by exponent, reduce exponent by 1." },
    { front: "What does the integral represent geometrically?", back: "The area under the curve between two points on the x-axis." },
    { front: "Differentiate f(x) = sin(x)", back: "f′(x) = cos(x)" },
    { front: "What is the chain rule?", back: "If y = f(g(x)), then dy/dx = f′(g(x)) · g′(x)" },
    { front: "Integrate: 2x dx", back: "x² + C" },
  ],
  "Statistics & Probability": [
    { front: "What is the mean of a data set?", back: "Sum of all values divided by the number of values.\nMean = Σx / n" },
    { front: "What is a normal distribution?", back: "A symmetric bell-shaped distribution where mean = median = mode." },
    { front: "P(A or B) = ?", back: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
    { front: "What is standard deviation?", back: "A measure of spread. Square root of variance.\nσ = √(Σ(x−μ)² / n)" },
    { front: "What does mutually exclusive mean?", back: "Two events that cannot both occur at the same time. P(A ∩ B) = 0" },
  ],
  "Forces & Motion": [
    { front: "State Newton's Second Law", back: "F = ma\nForce (N) = mass (kg) × acceleration (m/s²)" },
    { front: "Difference between speed and velocity?", back: "Speed is scalar (magnitude only). Velocity is vector (magnitude + direction)." },
    { front: "What is kinetic energy?", back: "KE = ½mv²\nm = mass (kg), v = velocity (m/s)" },
    { front: "What is terminal velocity?", back: "Constant speed when drag = gravity. Net force = 0, acceleration = 0." },
    { front: "Define momentum", back: "p = mv\nConserved in closed systems." },
  ],
  "Electricity & Magnetism": [
    { front: "State Ohm's Law", back: "V = IR\nVoltage (V) = Current (A) × Resistance (Ω)" },
    { front: "Series vs parallel circuits?", back: "Series: same current, voltages add.\nParallel: same voltage, currents add." },
    { front: "What is electric power?", back: "P = IV = I²R = V²/R" },
    { front: "What creates a magnetic field?", back: "Moving charges (electric current). A current-carrying wire produces a circular magnetic field." },
    { front: "State Faraday's Law", back: "An EMF is induced when the magnetic flux through a conductor changes.\nEMF = −dΦ/dt" },
  ],
  "Organic Chemistry": [
    { front: "What is a homologous series?", back: "A family of compounds with the same functional group, differing by CH₂ units." },
    { front: "Functional group of an alcohol?", back: "–OH (hydroxyl group). Example: ethanol CH₃CH₂OH" },
    { front: "What is addition polymerisation?", back: "Monomers with C=C double bonds join together. The double bond opens up to form a polymer chain." },
    { front: "Saturated vs unsaturated hydrocarbons?", back: "Saturated: only C–C single bonds (alkanes).\nUnsaturated: contain C=C double bonds (alkenes)." },
    { front: "What is fermentation?", back: "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂\nGlucose → Ethanol + CO₂ (using yeast, anaerobic)" },
  ],
  "Macroeconomics": [
    { front: "What is GDP?", back: "Gross Domestic Product — total monetary value of all goods and services produced in a country." },
    { front: "What causes demand-pull inflation?", back: "Aggregate demand rises faster than aggregate supply — too much money chasing too few goods." },
    { front: "What is the multiplier effect?", back: "An initial change in spending leads to a larger change in national income.\nMultiplier = 1 / (1 − MPC)" },
    { front: "What is a trade deficit?", back: "When imports exceed exports." },
    { front: "Define opportunity cost", back: "The value of the next best alternative forgone when making a decision." },
  ],
  "Time and light": [
    { front: "Speed of light in a vacuum?", back: "c ≈ 3 × 10⁸ m/s" },
    { front: "What is refraction?", back: "Bending of light as it passes from one medium to another due to a change in speed." },
    { front: "State Snell's Law", back: "n₁ sin θ₁ = n₂ sin θ₂" },
    { front: "What is total internal reflection?", back: "When light hits the boundary above the critical angle, all light reflects back. Used in optical fibres." },
    { front: "What is the critical angle?", back: "Minimum angle above which total internal reflection occurs.\nsin(c) = n₂/n₁" },
  ],
};

const FALLBACK_CARDS: Flashcard[] = [
  { front: "Accuracy vs precision?", back: "Accuracy: how close to the true value. Precision: how consistent/repeatable." },
  { front: "What is a hypothesis?", back: "A testable, falsifiable prediction about the relationship between variables." },
  { front: "Correlation vs causation?", back: "Two things being related does not mean one causes the other." },
];

function getCardsForTopic(topic: string): Flashcard[] {
  if (FLASHCARD_BANK[topic]) return FLASHCARD_BANK[topic];
  const key = Object.keys(FLASHCARD_BANK).find(
    (k) => k.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(k.toLowerCase())
  );
  return key ? FLASHCARD_BANK[key] : FALLBACK_CARDS;
}

export default function RevisionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const weakTopics = useMemo(() => {
    const stats = computeStats(user?.email || "");
    const results = getTestResults(user?.email || "");
    const topicMap: Record<string, { score: number; max: number }> = {};
    for (const r of results) {
      for (const tp of r.topicPerformance) {
        if (!topicMap[tp.topic]) topicMap[tp.topic] = { score: 0, max: 0 };
        topicMap[tp.topic].score += tp.score;
        topicMap[tp.topic].max += tp.maxScore;
      }
    }
    const topics = Object.entries(topicMap)
      .map(([t, d]) => ({ topic: t, pct: d.max > 0 ? (d.score / d.max) * 100 : 0 }))
      .filter((t) => t.pct < 70)
      .sort((a, b) => a.pct - b.pct)
      .map((t) => t.topic);

    return topics.length > 0
      ? topics
      : [stats.weakestTopic !== "N/A" ? stats.weakestTopic : "Algebra & Functions"];
  }, [user?.email]);

  const [activeTopic, setActiveTopic] = useState(weakTopics[0]);
  const cards = useMemo(() => getCardsForTopic(activeTopic), [activeTopic]);

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[cardIndex];
  const progress = Math.round((known.size / cards.length) * 100);

  const handleTopic = (t: string) => {
    setActiveTopic(t);
    setCardIndex(0);
    setIsFlipped(false);
    setKnown(new Set());
  };

  const goNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCardIndex((i) => (i + 1) % cards.length), 120);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCardIndex((i) => (i - 1 + cards.length) % cards.length), 120);
  };

  const handleGotIt = () => {
    setKnown((prev) => new Set([...prev, cardIndex]));
    goNext();
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <PageHeader
        title="Revision Mode"
        description="Flashcards for your weakest topics — tap to flip."
      />

      {/* Topic pills */}
      <div className="flex flex-wrap gap-2">
        {weakTopics.slice(0, 8).map((t) => (
          <button
            key={t}
            onClick={() => handleTopic(t)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-all ${
              activeTopic === t
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Card {cardIndex + 1} of {cards.length}</span>
          <span>{known.size} known · {progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl space-y-4">
          <motion.div
            key={`${activeTopic}-${cardIndex}-${isFlipped}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              className={`cursor-pointer min-h-[220px] select-none transition-colors ${
                isFlipped ? "bg-primary/5 border-primary/30" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[220px] gap-4">
                <Badge variant="outline" className="text-xs">
                  {isFlipped ? "Answer" : "Question"} · {activeTopic}
                </Badge>
                <p className="text-lg font-medium leading-relaxed whitespace-pre-line">
                  {isFlipped ? card.back : card.front}
                </p>
                {!isFlipped && (
                  <p className="text-xs text-muted-foreground">Tap card to reveal answer</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {isFlipped ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={goNext}
                >
                  <XCircle className="h-4 w-4" /> Review again
                </Button>
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleGotIt}
                >
                  <CheckCircle2 className="h-4 w-4" /> Got it
                </Button>
              </>
            ) : (
              <Button variant="outline" className="flex-1" onClick={() => setIsFlipped(true)}>
                Reveal Answer
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={goNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* All known */}
      {known.size === cards.length && cards.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">All cards known!</p>
                <p className="text-sm text-muted-foreground">Take a test to confirm your understanding.</p>
              </div>
              <Button className="ml-auto" onClick={() => router.push("/dashboard/test-builder")}>
                Take a Test
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
