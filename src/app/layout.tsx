import type { Metadata } from "next";
import { Geist, Geist_Mono, Tillana } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tillana = Tillana({
  weight: "400",
  variable: "--font-tillana",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Todo | Karel Pelcak",
  description: "A simple daily todo app to keep you focused and productive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tillana.variable} antialiased`}
      >
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
