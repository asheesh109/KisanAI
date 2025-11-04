import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata = {
  title: "KisanAI - AI-Powered Farming Assistant | किसान AI सहायक",
  description: "AI-powered farmer assistant for Indian farmers. Get farming advice, weather updates, market prices, and government scheme information.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ThemeProvider
          defaultTheme="system"
          storageKey="kisanai-theme"
        >
          <LanguageProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}