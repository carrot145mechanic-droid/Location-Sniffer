import { useState, useEffect } from 'react'
import MainPage from './pages/MainPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Verifică dacă URL-ul conține /admin
    const checkAdminPath = () => {
      const path = window.location.pathname
      console.log('Current path:', path) // Debug
      setIsAdmin(path === '/admin')
    }

    checkAdminPath()
    
    // Ascultă pentru schimbări în URL (opțional)
    window.addEventListener('popstate', checkAdminPath)
    return () => window.removeEventListener('popstate', checkAdminPath)
  }, [])

  console.log('Rendering:', isAdmin ? 'AdminPage' : 'MainPage') // Debug

  useEffect(() => {
  console.log('🔄 App mounted')
  console.log('📍 Current path:', window.location.pathname)
  console.log('🔗 Full URL:', window.location.href)
}, [])

  return (
    <div className="App">
      {isAdmin ? <AdminPage /> : <MainPage />}
    </div>
  )
}

export default App