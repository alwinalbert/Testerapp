"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestQuestion } from "@/types";

// Enable mhchem for chemical equations (\ce{H2O}, reaction arrows, etc.)
// This must run before katex is first used.
if (typeof window !== "undefined") {
  try {
    require("katex/contrib/mhchem");
  } catch { /* not critical */ }
}

// ── KaTeX / mhchem renderer ───────────────────────────────────────────────────
// Parses $...$ (inline), $$...$$ (block), and \ce{...} (chemistry) in text.
function MathText({ text }: { text: string }) {
  // Pre-process: wrap bare \ce{...} not inside $...$ so they get rendered
  const normalised = text.replace(/(?<!\$)\\ce\{([^}]+)\}/g, "$\\ce{$1}$");

  const segments: { start: number; end: number; latex: string; block: boolean }[] = [];
  const blockRegex = /\$\$([\s\S]+?)\$\$/g;
  const inlineRegex = /\$((?:[^$]|\\.)+?)\$/g;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(normalised)) !== null) {
    segments.push({ start: match.index, end: match.index + match[0].length, latex: match[1], block: true });
  }
  while ((match = inlineRegex.exec(normalised)) !== null) {
    if (segments.some((s) => match!.index >= s.start && match!.index < s.end)) continue;
    segments.push({ start: match.index, end: match.index + match[0].length, latex: match[1], block: false });
  }
  segments.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const seg of segments) {
    if (seg.start > last) parts.push(<span key={`t-${last}`}>{normalised.slice(last, seg.start)}</span>);
    parts.push(<KaTeXSpan key={`m-${seg.start}`} latex={seg.latex} block={seg.block} />);
    last = seg.end;
  }
  if (last < normalised.length) parts.push(<span key="t-end">{normalised.slice(last)}</span>);

  return <>{parts.length > 0 ? parts : <span>{text}</span>}</>;
}

function KaTeXSpan({ latex, block }: { latex: string; block: boolean }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const katex = require("katex");
    const html = katex.renderToString(latex, { throwOnError: false, displayMode: block });
    return (
      <span
        className={block ? "block my-3 text-center overflow-x-auto" : "inline"}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className="text-sm bg-muted px-1 rounded">{latex}</code>;
  }
}

// ── Audio player ───────────────────────────────────────────────────────────────
function AudioPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
      <Button variant="ghost" size="sm" className="gap-2 shrink-0" onClick={toggle}>
        {playing ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        {playing ? "Pause" : "Play audio"}
      </Button>
      <span className="text-xs text-muted-foreground">Listening comprehension — play before answering</span>
      <audio ref={ref} src={url} onEnded={() => setPlaying(false)} />
    </div>
  );
}

// ── Video player ───────────────────────────────────────────────────────────────
function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-black">
      <video
        ref={ref}
        src={url}
        onEnded={() => setPlaying(false)}
        className="w-full max-h-64 object-contain"
        playsInline
      />
      <div className="flex items-center gap-3 bg-muted/80 px-4 py-2">
        <Button variant="ghost" size="sm" className="gap-2" onClick={toggle}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Play video"}
        </Button>
        <span className="text-xs text-muted-foreground">Video stimulus — watch before answering</span>
      </div>
    </div>
  );
}

// ── Main QuestionStem component ────────────────────────────────────────────────
interface QuestionStemProps {
  question: TestQuestion;
}

export function QuestionStem({ question }: QuestionStemProps) {
  const { passage, image_url, image_alt, table, audio_url, video_url, question_text, label_positions } = question;

  // If this is a label-the-diagram type, don't render the image here —
  // the LabelDiagramQuestion component handles the full interaction.
  const isLabelDiagram = question.type === "label_diagram" as string;

  return (
    <div className="space-y-4">
      {/* Audio clip */}
      {audio_url && <AudioPlayer url={audio_url} />}

      {/* Short video clip */}
      {video_url && <VideoPlayer url={video_url} />}

      {/* Text stimulus passage */}
      {passage && (
        <div className="rounded-lg border-l-4 border-primary/40 bg-muted/40 px-5 py-4 text-sm leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Source / Stimulus
          </p>
          {passage}
        </div>
      )}

      {/* Static image (skip for label diagram — handled by LabelDiagramQuestion) */}
      {image_url && !isLabelDiagram && (
        <div className="rounded-lg border overflow-hidden bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image_url}
            alt={image_alt || "Question diagram"}
            className="mx-auto max-h-64 object-contain p-2"
          />
          {image_alt && (
            <p className="text-center text-xs text-muted-foreground pb-2">{image_alt}</p>
          )}
        </div>
      )}

      {/* Formatted table */}
      {table && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {table.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left font-semibold border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 1 ? "bg-muted/20" : ""}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 border-b border-border/50">
                      <MathText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Question text with KaTeX + mhchem rendering */}
      <p className="text-base leading-relaxed text-foreground/90">
        <MathText text={question_text} />
      </p>
    </div>
  );
}

// Re-export MathText for use in other components (e.g. MCQ options)
export { MathText };
