import type { Metadata } from "next";
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
  title: "Deep Mind - Professional OS",
  description: "Advanced tracking for High-Performance Operators",
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
          </DeepWorkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
