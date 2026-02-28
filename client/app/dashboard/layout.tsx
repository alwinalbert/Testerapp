import { Navbar } from "@/components/shared/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 TestPrep by Edukko. All rights reserved.
      </footer>
    </div>
  );
}
