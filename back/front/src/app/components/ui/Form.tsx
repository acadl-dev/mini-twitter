'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.first_name) newErrors.name = 'Name is mandatory'
    if (!formData.last_name) newErrors.surname = 'Last name is mandatory'
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.email) newErrors.email = 'Email is mandatory'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is mandatory'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long'
    if (formData.password !== formData.confirm_password) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setApiError(null)
      try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.first_name, // Corrigido
            last_name: formData.last_name,    // Corrigido
            username: formData.username,
            email: formData.email,
            password: formData.password,            
          }),
          
        })

        if (!response.ok) {
          throw new Error('Registration failed')
        }

        const data = await response.json()
        console.log('Registration successful:', data)
        // Redirect to login page or show success message
        router.push('/login')
      } catch (error) {
        console.error('Registration error:', error)
        setApiError('Registration failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="h-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Create your Mini Tweeter account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="first_name" className="text-sm">Name</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} className="h-8" />
                  {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last_name" className="text-sm">Surname</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} className="h-8" />
                  {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="username" className="text-sm">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="h-8" />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="h-8" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="h-8" />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm_password" className="text-sm">Confirm Password</Label>
                <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleInputChange} className="h-8" />
                {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button variant="outline" className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 font-bold py-2 px-4 rounded-full transition-all duration-300 text-sm">
                <Link href="/login">
                  Already have an account? Log in
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
        {(Object.keys(errors).length > 0 || apiError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {apiError || 'Please correct errors in the form before submitting.'}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}