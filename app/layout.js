import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "BODE FIT - Plano Adaptativo",
    description: "Plano adaptativo de exercícios e nutrição personalizado.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#16a34a" />
            </head>
            <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="flex-1">{children}</main>
                    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-6 text-center text-sm mt-auto z-10 relative">
                        <p>
                            Código sem fronteira: Desenvolvimento WEB com IA. Instrutor: Eliakim Rocha. Data: 25/02/2026.
                        </p>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
