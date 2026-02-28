"use client";

import { useState } from "react";
import { Share2, FileDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  testTitle: string;
  percentage: number;
  grade?: string;
}

export function ResultActions({
  testTitle,
  percentage,
  grade,
}: ResultActionsProps) {
  const [copied, setCopied] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard
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
    setGeneratingReport(true);
    // TODO: call n8n report generation webhook
    // The n8n workflow will receive { testTitle, percentage, grade }
    // and return a PDF/HTML report for download
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGeneratingReport(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleShare}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? "Link copied!" : "Share"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleDownloadReport}
        disabled={generatingReport}
      >
        {generatingReport ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        {generatingReport ? "Generating report…" : "Download Report"}
      </Button>
    </div>
  );
}
