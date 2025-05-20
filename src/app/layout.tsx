import "./globals.css";

import Header from './Header'
import Footer from './Footer'
import { ThemeProvider } from "@/app/ThemeContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <ThemeProvider>
        <Header/>
        <main className="flex-1 container mx-auto">
          {children}
        </main>
        <Footer/>
        </ThemeProvider>
      </body>
    </html>
  )
}