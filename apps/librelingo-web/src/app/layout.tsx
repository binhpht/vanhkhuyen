import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})

type RootLayoutProps = {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="vi">
            <head />
            <body className={cn('font-sans antialiased flex flex-col min-h-screen', fontSans.variable)}>
                <SessionProvider>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </SessionProvider>
            </body>
        </html>
    )
}
