import React from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { Link } from 'react-router'

const Login = () => {
  return (
    <section className="h-screen flex items-center justify-center">
      <form className="w-xl">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your Email address"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your Password"
              />
                <p className="text-base text-red-500"></p>
              <Button type="submit">Login</Button>
              <p>
                Don't have any account?
                <Link to="/registration" className="text-brand">
                  Registration
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Login