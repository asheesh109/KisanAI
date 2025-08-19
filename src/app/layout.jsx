import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "KisanAI - Farmer Assistant | किसान AI सहायक",
  description: "AI-powered farmer assistant for Indian farmers. Get farming advice, weather updates, market prices, and government scheme information.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider
          defaultTheme="system"
          storageKey="kisanai-theme"
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}