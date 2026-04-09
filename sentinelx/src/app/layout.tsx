import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/context/ThemeContext";
// import "@/utils/global-error-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentinelX | Enterprise Security Operations",
  description: "Enterprise Threat Intelligence, SIEM and SOAR platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!children) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <div>No content available</div>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col transition-theme bg-background text-foreground"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider>
            <AppProviders>{children}</AppProviders>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
