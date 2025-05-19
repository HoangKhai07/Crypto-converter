import "./globals.css";

import Header from './Header'
import Footer from './Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  )
}