import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import SingUpPage from './pages/SingUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore.js'
import HomePage from './pages/HomePage.jsx'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'
import ForgetPasswordPage from './pages/ForgetPasswordPage.jsx'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  const [isOnline, setIsOnline] = useState(typeof window != "undefined" ? window.navigator.onLine : false);

  useEffect(() => {
    const handleFunction = () => {
      if (window.navigator.onLine === true) {
        setIsOnline("online")
      } else if (window.navigator.onLine === false) {
        setIsOnline("offline")
      } else {
        setIsOnline(false)
      }
    };
    handleFunction();
    setTimeout(() => {
      setIsOnline(false)
    }, 3000);
  }, [isOnline])

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path='/singup' element={!authUser ? <SingUpPage /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/forget-password' element={!authUser ? <ForgetPasswordPage /> : <Navigate to={'/'} />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
      {["online", "offline"]?.includes(isOnline) ?
        <div className={`fixed bottom-0 left-0 w-full text-sm text-center ${isOnline == "online" ? "bg-green-500" : isOnline == "offline" ? "bg-zinc-400" : ""} text-white`}>
          {isOnline == "online" ? "Online" : isOnline == "offline" ? "Offline" : ""}
        </div>
        : ""}
      <Toaster />
    </div>
  )
}

export default App
