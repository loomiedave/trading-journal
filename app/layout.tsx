import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Pre - Trader",
  description: "Trading Journal - Build your trading edge",
  themeColor: "#0e1015",
  icons: {
    icon: [
      { url: "/manico.png", sizes: "192x192", type: "image/png" },
      { url: "/manico2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/manico.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className="antialiased bg-[#0e1015] text-[#c9cdd6]">
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
