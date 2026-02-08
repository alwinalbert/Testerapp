"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Clock,
  Palette,
  Volume2,
  Eye,
  Save,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { pageVariants, cardVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

function ToggleSwitch({ enabled, onChange, label, description, icon }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  // Notification settings
  const [notifications, setNotifications] = useState({
    testReminders: true,
    resultAlerts: true,
    weeklyReport: false,
    soundEnabled: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    fontSize: "medium" as "small" | "medium" | "large",
  });

  // Test settings
  const [testSettings, setTestSettings] = useState({
    autoSave: true,
    showTimer: true,
    confirmBeforeSubmit: true,
    defaultDuration: 60,
    questionsPerPage: 1,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    shareResults: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-8 max-w-3xl mx-auto"
        >
          <PageHeader
            title="Settings"
            description="Manage your preferences and account settings."
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Settings" },
            ]}
            actions={
              <Button className="gap-2" onClick={handleSave}>
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            }
          />

          {/* Appearance */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-2">
                    {[
                      { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
                      { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
                      { value: "system", label: "System", icon: <Globe className="h-4 w-4" /> },
                    ].map((t) => (
                      <Button
                        key={t.value}
                        variant={theme === t.value ? "default" : "outline"}
                        size="sm"
                        className="gap-2 flex-1"
                        onClick={() => setTheme(t.value)}
                      >
                        {t.icon}
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="flex gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <Button
                        key={size}
                        variant={appearance.fontSize === size ? "default" : "outline"}
                        size="sm"
                        className="flex-1 capitalize"
                        onClick={() =>
                          setAppearance({
                            ...appearance,
                            fontSize: size as "small" | "medium" | "large",
                          })
                        }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleSwitch
                  enabled={notifications.testReminders}
                  onChange={(v) => setNotifications({ ...notifications, testReminders: v })}
                  label="Test Reminders"
                  description="Get notified about upcoming tests"
                  icon={<Clock className="h-4 w-4" />}
                />
                <Separator />
                <ToggleSwitch
                  enabled={notifications.resultAlerts}
                  onChange={(v) => setNotifications({ ...notifications, resultAlerts: v })}
                  label="Result Alerts"
                  description="Get notified when results are ready"
                  icon={<Bell className="h-4 w-4" />}
                />
                <Separator />
                <ToggleSwitch
                  enabled={notifications.weeklyReport}
                  onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
                  label="Weekly Progress Report"
                  description="Receive a weekly summary of your progress"
                  icon={<Globe className="h-4 w-4" />}
                />
                <Separator />
                <ToggleSwitch
                  enabled={notifications.soundEnabled}
                  onChange={(v) => setNotifications({ ...notifications, soundEnabled: v })}
                  label="Sound Effects"
                  description="Play sounds for timer and notifications"
                  icon={<Volume2 className="h-4 w-4" />}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Preferences */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Test Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ToggleSwitch
                  enabled={testSettings.autoSave}
                  onChange={(v) => setTestSettings({ ...testSettings, autoSave: v })}
                  label="Auto-save Answers"
                  description="Automatically save answers as you type"
                />
                <Separator />
                <ToggleSwitch
                  enabled={testSettings.showTimer}
                  onChange={(v) => setTestSettings({ ...testSettings, showTimer: v })}
                  label="Show Timer"
                  description="Display countdown timer during tests"
                />
                <Separator />
                <ToggleSwitch
                  enabled={testSettings.confirmBeforeSubmit}
                  onChange={(v) => setTestSettings({ ...testSettings, confirmBeforeSubmit: v })}
                  label="Confirm Before Submit"
                  description="Show confirmation dialog before submitting"
                />
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">Default Test Duration</p>
                    <p className="text-xs text-muted-foreground">
                      Default time limit in minutes
                    </p>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min={10}
                      max={180}
                      value={testSettings.defaultDuration}
                      onChange={(e) =>
                        setTestSettings({
                          ...testSettings,
                          defaultDuration: parseInt(e.target.value) || 60,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleSwitch
                  enabled={privacy.showProfile}
                  onChange={(v) => setPrivacy({ ...privacy, showProfile: v })}
                  label="Public Profile"
                  description="Allow others to see your profile"
                  icon={<Eye className="h-4 w-4" />}
                />
                <Separator />
                <ToggleSwitch
                  enabled={privacy.shareResults}
                  onChange={(v) => setPrivacy({ ...privacy, shareResults: v })}
                  label="Share Results"
                  description="Allow sharing test results with teachers"
                  icon={<Shield className="h-4 w-4" />}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={cardVariants}>
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Clear Test History</p>
                    <p className="text-xs text-muted-foreground">
                      Delete all your test results and history
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/50">
                    Clear History
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
