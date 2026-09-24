import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/nav/top-nav";
import { BottomNav } from "@/components/nav/bottom-nav";
import { MobileTopBar } from "@/components/nav/mobile-top-bar";
import { ChatWithOlivia } from "@/components/chat/chat-with-olivia";

export const metadata: Metadata = {
  title: "ImpactFools Academia — Grow what makes you valuable.",
  description:
    "A personalized hub for opportunity, growth, learning, capability, wealth, productivity, leverage and influence. An Innergency product.",
  icons: {
    icon: [{ url: "/impactfools-icon.png?v=20260924", type: "image/png" }],
    shortcut: "/impactfools-icon.png?v=20260924",
    apple: "/impactfools-icon.png?v=20260924",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <div className="border-b border-ink bg-blue-dim px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Your capacity can grow. Start somewhere useful.
        </div>
        <TopNav />
        <MobileTopBar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <ChatWithOlivia />
        <BottomNav />
      </body>
    </html>
  );
}
