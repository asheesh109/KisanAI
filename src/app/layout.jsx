import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import OfflineBanner from "@/components/OfflineBanner";

export const metadata = {
  title: "KisanAI - AI-Powered Farming Assistant | किसान AI सहायक",
  description: "AI-powered farmer assistant for Indian farmers. Get farming advice, weather updates, market prices, and government scheme information.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KisanAI',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KisanAI" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
>
  Skip to main content
</a>
        <ThemeProvider
          defaultTheme="system"
          storageKey="kisanai-theme"
        >
          <LanguageProvider>
            <OfflineBanner />
            
            <Header />
            <main
  id="main-content"
  tabIndex={-1}
  className="flex-1"
>
  {children}
</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}