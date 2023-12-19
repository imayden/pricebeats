import './globals.css'
import type { Metadata } from 'next'
import Navbar from "../components/Navbar";
import { Inter, Space_Grotesk, MuseoModerno} from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
 });
const museoModerno = MuseoModerno({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
 });
 
export const metadata: Metadata = {
  title: 'Price Beats - Beat the Peaks, Catch the Lows!',
  description: 
  'Track prices and save smartly with Price Beats - Beat the Peaks, Catch the Lows, and discover the rhythm of savings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className='max-w-10xl mx-auto'>
          {/* Navbar */}
          <Navbar />
          {children}
        </main>  
      </body>
    </html>
  )
}
