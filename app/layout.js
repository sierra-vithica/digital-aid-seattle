import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sierra Layla Vithica | Demo App',
  description: 'Created by Sierra Layla Vithica for Digital Aid Seattle',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#003029]`}>{children}</body>
    </html>
  )
}
