import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kabaad to Karodpati | Desi Auto & Scrap Empire",
  description: "The Ultimate Indian Trade, Automotive & Business Life Simulator",
  keywords: ["simulation", "tycoon", "indian", "automotive", "scrap", "business"],
  authors: [{ name: "Kabaad to Karodpati Team" }],
  openGraph: {
    title: "Kabaad to Karodpati",
    description: "Build your automotive empire from scrap to crores",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ed730c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}