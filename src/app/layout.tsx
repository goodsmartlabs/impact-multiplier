import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/nav/top-nav";
import { BottomNav } from "@/components/nav/bottom-nav";
import { MobileTopBar } from "@/components/nav/mobile-top-bar";

export const metadata: Metadata = {
  title: "Impact Academia — Grow what makes you valuable.",
  description:
    "A personalized hub for opportunity, growth, learning, capability, wealth, productivity, leverage and influence. An Innergency product.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <TopNav />
        <MobileTopBar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
