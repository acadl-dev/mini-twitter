"use client" // Adicione esta linha

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/Textarea"
import { CameraIcon, SendIcon, ImageIcon } from "lucide-react"

export default function HomePage() {
  const [profilePhoto, setProfilePhoto] = useState("/placeholder.svg?height=200&width=200")
  const [tweetText, setTweetText] = useState('')
  const [tweetImage, setTweetImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem('authToken')
      const refreshToken = localStorage.getItem('jwtRefreshToken')
      if (!token && refreshToken) {
        await getNewAccessToken()
      }
    }
    checkAndRefreshToken()
  }, [])

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTweetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTweetImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getNewAccessToken = async () => {
    const refreshToken = localStorage.getItem('jwtRefreshToken')
    if (!refreshToken) return null

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('authToken', data.access)
        return data.access
      } else {
        setApiResponse({ success: false, message: data.detail || 'Session expired. Please log in again.' })
        return null
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      setApiResponse({ success: false, message: 'An error occurred. Please try again later.' })
      return null
    }
  }

  const handleSubmitTweet = async () => {
    setIsLoading(true)
    setApiResponse(null)
  
    const token = await getNewAccessToken() || localStorage.getItem('authToken')
    if (!token) {
      setApiResponse({ success: false, message: 'You must be logged in to post a tweet.' })
      setIsLoading(false)
      return
    }
  
    const postTweet = async (token: string) => {
      try {
        const formData = new FormData()
        formData.append('content', tweetText)
        if (tweetImage) {
          const response = await fetch(tweetImage)
          const blob = await response.blob() // Obtendo um blob a partir da URL da imagem
          formData.append('image', blob, 'tweetImage.png') // Adicionando o blob como arquivo
        }
  
        const response = await fetch('http://127.0.0.1:8000/api/posts/create/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData, // Envia o FormData
        })
  
        const data = await response.json()
        if (response.ok) {
          setApiResponse({ success: true, message: 'Tweet posted successfully!' })
          setTweetText('')
          setTweetImage(null)
        } else if (response.status === 401 && data.code === 'token_not_valid') {
          const newToken = await getNewAccessToken()
          if (newToken) {
            await postTweet(newToken)
          }
        } else {
          setApiResponse({ success: false, message: data.message || 'Failed to post tweet. Please try again.' })
        }
      } catch (error) {
        setApiResponse({ success: false, message: 'An error occurred. Please try again later.' })
      } finally {
        setIsLoading(false)
      }
    }  
    
    await postTweet(token)
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profilePhoto} alt="Profile photo" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Label htmlFor="profile-photo-upload" className="cursor-pointer">
                      <CameraIcon className="h-8 w-8 text-white" />
                      <span className="sr-only">Change profile photo</span>
                    </Label>
                    <Input 
                      id="profile-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfilePhotoChange}
                    />
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-semibold">User Name</h2>
                <p className="text-gray-500">@username</p>
              </div>

              {apiResponse && (
                <Alert variant={apiResponse.success ? "default" : "destructive"}>
                  <AlertTitle>{apiResponse.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>
                    {apiResponse.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Label htmlFor="tweet-text">What's happening?</Label>
                <Textarea 
                  id="tweet-text"
                  placeholder="Share your thoughts..."
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleTweetImageUpload}
                  />
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handleSubmitTweet}
                    disabled={isLoading || (!tweetText && !tweetImage)}
                  >
                    {isLoading ? (
                      'Posting...'
                    ) : (
                      <>
                        <SendIcon className="h-4 w-4 mr-2" />
                        Tweet
                      </>
                    )}
                  </Button>
                </div>
                {tweetImage && (
                  <div className="mt-4">
                    <img src={tweetImage} alt="Tweet image" className="max-w-full h-auto max-h-64 rounded-lg" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
