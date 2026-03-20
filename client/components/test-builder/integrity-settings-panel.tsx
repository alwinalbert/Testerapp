"use client";

import { Shield, Eye, Clipboard, MousePointer, Maximize2, Timer, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IntegritySettings } from "@/types";

interface IntegritySettingsPanelProps {
  settings: IntegritySettings;
  onChange: (settings: IntegritySettings) => void;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  priority: "critical" | "high" | "medium";
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  children?: React.ReactNode;
}

function ToggleRow({ icon, label, description, priority, checked, onCheckedChange, children }: ToggleRowProps) {
  const priorityColor =
    priority === "critical"
      ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
      : priority === "high"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
      : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Label className="text-sm font-medium cursor-pointer">{label}</Label>
              <Badge className={`text-[10px] px-2 py-0 font-medium rounded-full ${priorityColor}`}>
                {priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0 mt-0.5" />
      </div>
      {checked && children && <div className="ml-7">{children}</div>}
    </div>
  );
}

export function IntegritySettingsPanel({ settings, onChange }: IntegritySettingsPanelProps) {
  const update = (patch: Partial<IntegritySettings>) => onChange({ ...settings, ...patch });

  const activeCount = [
    settings.tabSwitchDetection,
    settings.copyPasteBlocking,
    settings.rightClickDisable,
    settings.fullScreenMode,
    settings.timePerQuestionSeconds > 0,
    settings.singleAttemptLock,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Academic Integrity
          </span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeCount} active
            </Badge>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Toggle on for class tests and mock exams. Leave off for casual practice.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <ToggleRow
          icon={<Eye className="h-4 w-4" />}
          label="Tab Switch Detection"
          description="Logs when student leaves the test window — warns on first switch, submits on third"
          priority="critical"
          checked={settings.tabSwitchDetection}
          onCheckedChange={(v) => update({ tabSwitchDetection: v })}
        />

        <Separator />

        <ToggleRow
          icon={<Clipboard className="h-4 w-4" />}
          label="Copy / Paste Blocking"
          description="Disables copy and paste — prevents pasting questions into ChatGPT"
          priority="high"
          checked={settings.copyPasteBlocking}
          onCheckedChange={(v) => update({ copyPasteBlocking: v })}
        />

        <Separator />

        <ToggleRow
          icon={<MousePointer className="h-4 w-4" />}
          label="Right-Click Disable"
          description="Disables the browser context menu — prevents easy text inspection"
          priority="high"
          checked={settings.rightClickDisable}
          onCheckedChange={(v) => update({ rightClickDisable: v })}
        />

        <Separator />

        <ToggleRow
          icon={<Maximize2 className="h-4 w-4" />}
          label="Full-Screen Mode"
          description="Prompts student to enter full-screen — test pauses if they exit"
          priority="high"
          checked={settings.fullScreenMode}
          onCheckedChange={(v) => update({ fullScreenMode: v })}
        />

        <Separator />

        <ToggleRow
          icon={<Timer className="h-4 w-4" />}
          label="Time Limit per Question"
          description="Auto-advances when time runs out — reduces time to search externally"
          priority="high"
          checked={settings.timePerQuestionSeconds > 0}
          onCheckedChange={(v) => update({ timePerQuestionSeconds: v ? 120 : 0 })}
        >
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={15}
              max={600}
              value={settings.timePerQuestionSeconds}
              onChange={(e) => update({ timePerQuestionSeconds: Math.max(15, Number(e.target.value)) })}
              className="w-24 h-8 text-sm"
            />
            <span className="text-xs text-muted-foreground">seconds per question</span>
          </div>
        </ToggleRow>

        <Separator />

        <ToggleRow
          icon={<Lock className="h-4 w-4" />}
          label="Single Attempt Lock"
          description="Student cannot retake until teacher resets — requires backend support"
          priority="high"
          checked={settings.singleAttemptLock}
          onCheckedChange={(v) => update({ singleAttemptLock: v })}
        />

        {settings.singleAttemptLock && (
          <p className="ml-7 text-xs text-amber-600 dark:text-amber-400">
            Requires Supabase attempt tracking — tell your backend mate to enable this.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
