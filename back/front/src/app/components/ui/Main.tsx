'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { HeartIcon, MessageCircleIcon, Repeat2Icon, UserPlusIcon, SendIcon } from "lucide-react"
import Link from 'next/link'

export default function Component() {
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [tweetText, setTweetText] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Mini Tweeter
        </motion.h1>
        <motion.p 
          className="text-xl text-center mb-12 text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A new social media experience inspired by Twitter
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">Main Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Create, edit and delete tweets</li>
                  <li>Like friends' tweets</li>
                  <li>Follow other users</li>
                  <li>Personalized feed based on who you follow</li>
                  <li>User-friendly and responsive interface</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">User Interface</CardTitle>
                <CardDescription>A preview of the Tweeter experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input 
                    placeholder="O que está acontecendo?" 
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className="pr-10"
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600"
                    onClick={() => setTweetText('')}
                    disabled={!tweetText}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">Miguel Rocha</p>
                      <p className="text-sm text-gray-500">I just joined Tweeter! #NewHere</p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="ghost" size="sm"><MessageCircleIcon className="h-4 w-4 mr-1" /> 3</Button>
                        <Button variant="ghost" size="sm"><Repeat2Icon className="h-4 w-4 mr-1" /> 5</Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsLiked(!isLiked)}
                          className={isLiked ? 'text-red-500' : ''}
                        >
                          <HeartIcon className="h-4 w-4 mr-1" /> {isLiked ? 11 : 10}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">Maria Silva</p>
                    <Button 
                      variant={isFollowing ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing ? 'bg-green-100 text-green-700' : ''}
                    >
                      {isFollowing ? (
                        <>Seguindo</>
                      ) : (
                        <>
                          <UserPlusIcon className="h-4 w-4 mr-2" />
                          Seguir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
            <Link href="/register">
          Join us!
          </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}