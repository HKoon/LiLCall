import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "@/components/providers/Provider";

export const metadata: Metadata = {
  title: "Linkin.Love - Call your love",
  description: "Call your AI lover in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col min-h-screen"
        )}
      >
        <Provider>
          {/* <Nav /> */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
