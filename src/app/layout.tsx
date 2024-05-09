import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import AuthHeader from '@/components/AuthHeader'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quizz AI App',
  description: 'Generated Quizzes with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={"dark"}>
          <AuthHeader />
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
