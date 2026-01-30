// import React from 'react'
import logo from '../../assets/logo.png'
import { AuthPrompt } from '../../components/ui/AuthPrompt'
import { Footer } from '../../components/ui/Footer'
import { HrLine } from '../../components/ui/HrLine'
import { RegisterForm } from '../../features/auth/components/RegisterForm'


export const RegisterPage = () => {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center bg-white px-4'>
      <img src={logo} className='w-22 h-22' />

      <div className='max-w-md w-full bg-white-100 px-10 pb-5'>

        <h2 className='text-2xl font-bold text-gray-900 mb-1 text-center'>Create an Account</h2>
        <p className='text-gray-500 mb-8 text-center text-sm'>Sign up to get started.</p>

        <RegisterForm />
        <AuthPrompt text="Already have an account?" linkText="Login here" linkTo="/login" />

      </div>
        <HrLine />
        <Footer />

    </div>
  )
}
