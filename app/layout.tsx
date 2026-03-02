import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono, Space_Mono } from "next/font/google";
import { DeepWorkProvider } from "@/components/providers/deep-work-provider";
// import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deep Mind - The 90-Day Career Sprint Protocol",
  description: "A structured career acceleration system for early-career engineers. Force momentum with timebound execution cycles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceMono.variable} antialiased`}
      >
        <AuthProvider>
          <DeepWorkProvider>
            {children}
            <Analytics />
          </DeepWorkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
