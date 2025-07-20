import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import GreenHeader from '@/components/GreenHeader';
import Footer from "@/components/layout/Footer";
import { LoadingProvider } from '@/context/LoadingContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WasteX - Smart Waste Management",
  description: "Revolutionizing waste management through technology and community engagement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-primary-dark dark:bg-primary-dark dark:text-background">
        <Providers>
          <LoadingProvider>
            <GreenHeader />
            <main className="flex-grow pt-28">
              {children}
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#4aed88',
                    color: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#ff4b4b',
                    color: '#fff',
                  },
                },
              }}
            />
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
