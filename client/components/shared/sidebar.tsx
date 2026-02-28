"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  BookOpen,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sidebarVariants } from "@/lib/animations";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/test-builder", label: "Create Test", icon: FileText },
  { href: "/dashboard/results", label: "My Results", icon: BarChart3 },
];

const teacherNavItems = [
  { href: "/dashboard/teacher", label: "Teacher", icon: GraduationCap },
];

const secondaryNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-card",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4 mx-3" />

          {/* Teacher section */}
          {!collapsed && (
            <p className="px-6 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Teacher
            </p>
          )}
          <nav className="space-y-1 px-3">
            {teacherNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4 mx-3" />

          <nav className="space-y-1 px-3">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse Toggle */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}

// Mobile-friendly sidebar overlay
interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className="fixed left-0 top-0 z-50 h-full w-72 bg-card shadow-xl md:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">TestPrep</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {mainNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4 mx-3" />

            <p className="px-6 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Teacher
            </p>
            <nav className="space-y-1 px-3 mb-2">
              {teacherNavItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4 mx-3" />

            <nav className="space-y-1 px-3">
              {secondaryNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
