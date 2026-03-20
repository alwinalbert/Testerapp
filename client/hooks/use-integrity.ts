"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { IntegritySettings } from "@/types";

export interface IntegrityState {
  tabSwitchCount: number;
  isFullScreen: boolean;
  isTestPaused: boolean; // true when fullscreen exited
  warningMessage: string | null;
  dismissWarning: () => void;
  requestFullScreen: () => void;
}

const MAX_TAB_SWITCHES_BEFORE_SUBMIT = 3;

export function useIntegrity(
  settings: IntegritySettings | undefined,
  onForceSubmit: () => void
): IntegrityState {
  const s = settings;
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTestPaused, setIsTestPaused] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const tabSwitchRef = useRef(0);

  const dismissWarning = useCallback(() => setWarningMessage(null), []);

  const requestFullScreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  }, []);

  // ── Tab Switch Detection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!s?.tabSwitchDetection) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);

        if (tabSwitchRef.current >= MAX_TAB_SWITCHES_BEFORE_SUBMIT) {
          setWarningMessage("Maximum tab switches reached. Your test is being submitted.");
          setTimeout(onForceSubmit, 2000);
        } else {
          setWarningMessage(
            `Warning ${tabSwitchRef.current}/${MAX_TAB_SWITCHES_BEFORE_SUBMIT - 1}: You left the test window. ` +
            `Your teacher has been notified. On the ${MAX_TAB_SWITCHES_BEFORE_SUBMIT}rd switch, your test will be auto-submitted.`
          );
        }
      }
    };

    const handleBlur = () => {
      // Also catch focus leaving the window entirely (e.g. alt-tab)
      if (!document.hidden) handleVisibilityChange();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [s?.tabSwitchDetection, onForceSubmit]);

  // ── Copy / Paste Blocking ─────────────────────────────────────────────────
  useEffect(() => {
    if (!s?.copyPasteBlocking) return;

    const block = (e: ClipboardEvent) => {
      e.preventDefault();
      setWarningMessage("Copy and paste is disabled during this test.");
    };

    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
    };
  }, [s?.copyPasteBlocking]);

  // ── Right-Click Disable ───────────────────────────────────────────────────
  useEffect(() => {
    if (!s?.rightClickDisable) return;

    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, [s?.rightClickDisable]);

  // ── Full-Screen Mode ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!s?.fullScreenMode) return;

    // Prompt on mount
    if (!document.fullscreenElement) {
      requestFullScreen();
    }

    const handleFullscreenChange = () => {
      const inFS = !!document.fullscreenElement;
      setIsFullScreen(inFS);

      if (!inFS) {
        // Student exited fullscreen
        setIsTestPaused(true);
        setWarningMessage("You exited full-screen. The test is paused. Re-enter full-screen to continue.");
      } else {
        setIsTestPaused(false);
        setWarningMessage(null);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [s?.fullScreenMode, requestFullScreen]);

  return {
    tabSwitchCount,
    isFullScreen,
    isTestPaused,
    warningMessage,
    dismissWarning,
    requestFullScreen,
  };
}
