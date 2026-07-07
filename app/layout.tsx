import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pre - Trader",
  description: "Trading Journal - Build your trading edge",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/manico.png", sizes: "192x192", type: "image/png" },
      { url: "/manico2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/manico.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pre-Trader",
  },
};


export const viewport: Viewport = {
  themeColor: "#0e1015",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className="antialiased bg-[#0e1015] text-[#c9cdd6]">
        <NextTopLoader color="#4f7cff" showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
