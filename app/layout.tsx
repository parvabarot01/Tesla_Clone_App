import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-neutral-950">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
