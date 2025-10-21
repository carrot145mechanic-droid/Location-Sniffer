import { useState, useEffect } from 'react'
import MainPage from './pages/MainPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Verifică dacă URL-ul conține /admin
    if (window.location.pathname === '/admin') {
      setIsAdmin(true)
    }
  }, [])

  return (
    <div className="App">
      {isAdmin ? <AdminPage /> : <MainPage />}
    </div>
  )
}

export default App