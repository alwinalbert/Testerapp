"use client";

import { useState } from "react";
import { Share2, FileDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestResults } from "@/types";

interface ResultActionsProps {
  testTitle: string;
  percentage: number;
  grade?: string;
  results?: TestResults;
}

function generateReportHTML(results: TestResults): string {
  const { testPaper, evaluations, totalScore, maxScore, percentage, topicPerformance, strengths, weaknesses, suggestions, timeTaken } = results;
  const mins = Math.floor((timeTaken || 0) / 60);
  const secs = (timeTaken || 0) % 60;

  const topicRows = topicPerformance.map(t => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${t.topic}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${t.questionsCorrect}/${t.questionsTotal}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${t.score}/${t.maxScore}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:${t.percentage >= 70 ? '#16a34a' : t.percentage >= 50 ? '#d97706' : '#dc2626'};font-weight:600">${t.percentage}%</td>
    </tr>
  `).join("");

  const questionRows = testPaper.questions.map((q, i) => {
    const ev = evaluations.find(e => e.question_id === q.question_id);
    const pct = ev ? Math.round((ev.marks / ev.max_marks) * 100) : 0;
    return `
    <div style="margin-bottom:20px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;page-break-inside:avoid">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-weight:600;color:#374151">Q${i + 1}. ${q.topic} <span style="font-size:11px;color:#9ca3af;font-weight:400">(${q.difficulty})</span></span>
        <span style="font-weight:700;color:${pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'}">${ev?.marks ?? 0}/${q.marks} marks</span>
      </div>
      <p style="color:#374151;margin:0 0 8px 0;font-size:14px">${q.question_text}</p>
      ${ev?.report ? `<p style="color:#6b7280;font-size:13px;margin:0;padding:8px;background:#f9fafb;border-radius:4px">📝 ${ev.report}</p>` : ""}
    </div>
  `}).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Test Report — ${testPaper.metadata.title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 600; margin: 28px 0 12px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
</style>
</head>
<body>

<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
  <div>
    <div style="font-size:12px;color:#6b7280;margin-bottom:4px">TestPrep by Edukko</div>
    <h1>${testPaper.metadata.title}</h1>
    <div style="color:#6b7280;font-size:14px;margin-top:4px">${testPaper.metadata.subject}${testPaper.metadata.examBoard ? ' · ' + testPaper.metadata.examBoard.replace(/_/g, ' ').toUpperCase() : ''}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:40px;font-weight:800;color:${percentage >= 70 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626'}">${percentage}%</div>
    <div style="font-size:13px;color:#6b7280">${totalScore} / ${maxScore} marks</div>
    <div style="font-size:13px;color:#6b7280">Time: ${mins}m ${secs}s</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">
  ${[
    ["Correct", evaluations.filter(e => e.is_correct).length, "#16a34a"],
    ["Incorrect", evaluations.filter(e => !e.is_correct).length, "#dc2626"],
    ["Total Questions", testPaper.metadata.total_questions, "#374151"]
  ].map(([label, val, color]) => `
    <div style="padding:16px;border:1px solid #e5e7eb;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:700;color:${color}">${val}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:4px">${label}</div>
    </div>
  `).join("")}
</div>

${strengths.length > 0 || weaknesses.length > 0 ? `
<h2>Strengths & Weaknesses</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px">
  <div style="padding:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px">
    <div style="font-size:12px;font-weight:600;color:#16a34a;margin-bottom:8px">STRENGTHS</div>
    ${strengths.length > 0 ? strengths.map(s => `<div style="font-size:13px;color:#374151;margin-bottom:4px">✓ ${s}</div>`).join("") : '<div style="font-size:13px;color:#6b7280">Keep practising!</div>'}
  </div>
  <div style="padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px">
    <div style="font-size:12px;font-weight:600;color:#dc2626;margin-bottom:8px">NEEDS WORK</div>
    ${weaknesses.length > 0 ? weaknesses.map(w => `<div style="font-size:13px;color:#374151;margin-bottom:4px">✗ ${w}</div>`).join("") : '<div style="font-size:13px;color:#6b7280">No major weaknesses!</div>'}
  </div>
</div>
` : ""}

<h2>Topic Breakdown</h2>
<table>
  <thead><tr>
    <th>Topic</th><th style="text-align:center">Questions</th><th style="text-align:center">Marks</th><th style="text-align:center">Score</th>
  </tr></thead>
  <tbody>${topicRows}</tbody>
</table>

${suggestions.length > 0 ? `
<h2>AI Suggestions</h2>
<div style="padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px">
  ${suggestions.map(s => `<div style="font-size:14px;color:#1e40af;margin-bottom:6px">• ${s}</div>`).join("")}
</div>
` : ""}

<h2>Question Review</h2>
${questionRows}

<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center">
  Generated by TestPrep by Edukko · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · © 2026 All rights reserved
</div>

<div class="no-print" style="margin-top:24px;text-align:center">
  <button onclick="window.print()" style="padding:10px 24px;background:#111827;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer">🖨 Print / Save as PDF</button>
</div>

</body>
</html>`;
}

export function ResultActions({ testTitle, percentage, grade, results }: ResultActionsProps) {
  const [copied, setCopied] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;
    setGeneratingReport(true);
    try {
      const html = generateReportHTML(results);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${testTitle.replace(/[^a-z0-9]/gi, "_")}_Report.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
        {copied ? "Link copied!" : "Share"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleDownloadReport}
        disabled={generatingReport || !results}
      >
        {generatingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        {generatingReport ? "Generating…" : "Download Report"}
      </Button>
    </div>
  );
}
