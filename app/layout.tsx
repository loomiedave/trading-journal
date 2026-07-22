import type { Metadata, Viewport } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: "Pre - Trader",
  description: "Trading Journal - Build your trading edge",
  icons: {
    icon: [
      { url: "/manico.png", sizes: "192x192", type: "image/png" },
      { url: "/manico2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/manico.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fd" },
    { media: "(prefers-color-scheme: dark)", color: "#131722" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>

        <body className="antialiased bg-background text-foreground font-mono">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#4f7cff"
            height={4}
            showSpinner={true}
            crawl={true}
            crawlSpeed={200}
            speed={400}
            shadow="0 0 10px #4f7cff, 0 0 5px #4f7cff"
            zIndex={9999}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
