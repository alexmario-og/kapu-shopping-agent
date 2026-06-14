import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-noto-sinhala",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kapu — Kapruka's Shopping Companion",
  description:
    "Chat with Kapu to discover, gift, and order from Kapruka — in English, Sinhala, or Tanglish.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${jakarta.variable} ${notoSinhala.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
