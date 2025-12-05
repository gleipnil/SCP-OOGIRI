import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import GlobalEffects from "../components/GlobalEffects";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scp-oogiri.com'),
  title: "SCP Foundation Database",
  description: "Secure, Contain, Protect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${shareTechMono.variable} font-mono antialiased theme-terminal`}>
        <GlobalEffects />
        {children}
      </body>
    </html>
  );
}
