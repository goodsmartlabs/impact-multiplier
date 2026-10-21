import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Pulse — Editorial",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-cream">{children}</div>;
}
