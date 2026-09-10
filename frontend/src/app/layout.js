import './globals.css'

export const metadata = {
  title: 'ChainAscent | Web3 Multiplier Crash Game',
  description: 'Containerized Web3 game ecosystem with Next.js, Express, Hardhat & PostgreSQL.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}
