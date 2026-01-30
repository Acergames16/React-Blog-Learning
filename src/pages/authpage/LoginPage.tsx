// import React from 'react'
import logo from '../../assets/logo.png'
import { Footer } from '../../components/ui/Footer'
import { HrLine } from '../../components/ui/HrLine'
import { AuthPrompt } from '../../components/ui/AuthPrompt'
import { LoginForm } from '../../features/auth/components/LoginForm'

export const LoginPage = () => {
 
  return (
    // Body is now White
     <div className='flex flex-col min-h-screen items-center justify-center bg-white px-4'>
      <img src={logo} className='w-22 h-22' />

      <div className='max-w-md w-full bg-white-100 px-10 pb-5'>

        <h2 className='text-2xl font-bold text-gray-900 mb-1 text-center'>Welcome Back</h2>
        <p className='text-gray-500 mb-8 text-center text-sm'>Sign in to start interacting.</p>

        <LoginForm />
        <AuthPrompt text="Don't have an account yet?" linkText="Register here" linkTo="/register" />

      </div>
        <HrLine/>
        <Footer />

    </div>
  )
}