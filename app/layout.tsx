import type { Metadata } from "next";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion";
import "./globals.css";

const sans = localFont({
  src: "../public/fonts/space-grotesk-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "300 700",
});
const serif = localFont({
  src: "../public/fonts/fraunces-latin.woff2",
  variable: "--font-serif",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://meet.tony-dong.com"),
  title: "Meet · Coffee, somewhere between",
  description:
    "Find a San Francisco café that works for both of you. Two starting points, a fair walk, and time for a coffee.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
