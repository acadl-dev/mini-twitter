'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Label } from "@/app/components/ui/label"
import { Edit, Trash2, Heart, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/Textarea"
import Image from 'next/image'

interface Tweet {
  id: number;
  username: string;
  content: string;
  likes_count: number;
  image_url?: string;
}

export default function MyTweets() {
  const [myTweets, setMyTweets] = useState<Tweet[]>([])
  const [visibleTweets, setVisibleTweets] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    fetchMyTweets()
  }, [])

  const fetchMyTweets = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://127.0.0.1:8000/api/posts/feed/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tweets')
      }
      const data: Tweet[] = await response.json()
      setMyTweets(data)
      setVisibleTweets(data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching tweets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (tweet: Tweet) => {
    setEditingTweet(tweet)
  }

  const handleDelete = async (tweetId: number) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://127.0.0.1:8000/api/posts/delete/${tweetId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete tweet')
      }
      setMyTweets(prevTweets => prevTweets.filter(tweet => tweet.id !== tweetId))
      setVisibleTweets(prevTweets => prevTweets.filter(tweet => tweet.id !== tweetId))
    } catch (error) {
      console.error('Error deleting tweet:', error)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingTweet) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://127.0.0.1:8000/api/posts/edit/${editingTweet.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingTweet.content,
          image_url: editingTweet.image_url,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update tweet')
      }
      const updatedTweet = await response.json()
      setMyTweets(prevTweets => prevTweets.map(tweet =>
        tweet.id === updatedTweet.id ? updatedTweet : tweet
      ))
      setVisibleTweets(prevTweets => prevTweets.map(tweet =>
        tweet.id === updatedTweet.id ? updatedTweet : tweet
      ))
      setEditingTweet(null)
    } catch (error) {
      console.error('Error updating tweet:', error)
    }
  }

  const renderTweet = (tweet: Tweet) => (
    <Card key={tweet.id} className="mb-4">
      <CardContent className="flex items-start space-x-4 pt-6">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={tweet.username} />
          <AvatarFallback>{tweet.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold">{tweet.username}</p>
          <p className="text-sm text-gray-500">{tweet.content}</p>
          {tweet.image_url && (
            <div className="mt-2 relative w-full h-40">
              <Image
                src={tweet.image_url}
                alt="Tweet image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
          <div className="flex items-center mt-2 text-sm text-gray-500">

            <div className="flex items-center mt-2 space-x-2 text-sm text-gray-500">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
               
              >
                <Heart className={`h-4 w-4 ${false ? 'text-red-500' : 'text-gray-500'}`} />
              </Button>
              <span className="ml-1">{tweet.likes_count}</span> {/* Adiciona uma margem à esquerda */}
            </div>

            {tweet.image_url && (
              <div className="ml-4 flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span>Image</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleEdit(tweet)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit tweet</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleDelete(tweet.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete tweet</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const lastTweetElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleTweets.length < myTweets.length) {
        setVisibleTweets(prevTweets => [
          ...prevTweets,
          ...myTweets.slice(prevTweets.length, prevTweets.length + 10)
        ])
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, visibleTweets, myTweets])

  return (
    <>
      <div ref={containerRef} className="h-[calc(100vh-200px)] overflow-y-auto">
        {visibleTweets.map((tweet, index) => (
          <div key={tweet.id} ref={index === visibleTweets.length - 1 ? lastTweetElementRef : null}>
            {renderTweet(tweet)}
          </div>
        ))}
        {isLoading && <p className="text-center">Loading...</p>}
      </div>

      <AnimatePresence>
        {editingTweet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Tweet</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditingTweet(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tweet-content">Content</Label>
                  <Textarea
                    id="tweet-content"
                    value={editingTweet.content}
                    onChange={(e) => setEditingTweet({ ...editingTweet, content: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tweet-image">Image URL</Label>
                  <Input
                    id="tweet-image"
                    type="text"
                    value={editingTweet.image_url || ''}
                    onChange={(e) => setEditingTweet({ ...editingTweet, image_url: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}