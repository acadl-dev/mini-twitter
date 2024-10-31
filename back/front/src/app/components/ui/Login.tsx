'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }  

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setApiResponse(null)
      try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: formData.usernameOrEmail,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Armazenar o access e refresh tokens
          localStorage.setItem('authToken', data.access)
          localStorage.setItem('refreshToken', data.refresh)
          setApiResponse({ success: true, message: 'Login successful!' })
          router.push('/home')
        } else {
          setApiResponse({ success: false, message: data.message || 'Login failed. Please try again.' })
        }
      } catch (error) {
        setApiResponse({ success: false, message: 'An error occurred. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Log in to Mini Tweeter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usernameOrEmail">Username or Email</Label>
                <Input 
                  id="usernameOrEmail" 
                  name="usernameOrEmail" 
                  value={formData.usernameOrEmail} 
                  onChange={handleInputChange} 
                  placeholder="Enter your username or email"
                />
                {errors.usernameOrEmail && <p className="text-red-500 text-sm">{errors.usernameOrEmail}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-full transition-all duration-300"
              >
                <Link href="/register" className="w-full block">
                  Don't have an account? Sign up
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
        {(Object.keys(errors).length > 0 || apiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Please correct errors in the form before submitting.
                </AlertDescription>
              </Alert>
            )}
            {apiResponse && (
              <Alert variant={apiResponse.success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{apiResponse.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {apiResponse.message}
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
