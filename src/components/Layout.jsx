import { Outlet } from 'react-router-dom'
import { Footer } from './Footer.jsx'
import { Navbar } from './Navbar.jsx'

export function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16 pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}