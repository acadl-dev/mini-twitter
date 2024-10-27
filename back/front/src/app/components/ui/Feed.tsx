'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import MyTweets from "@/app/components/ui/myTweets"
import Global from '@/app/components/ui/Global'

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('my-tweets')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-tweets">My Tweets</TabsTrigger>
              <TabsTrigger value="following-tweets">Following</TabsTrigger>
              <TabsTrigger value="global-tweets">Global</TabsTrigger>
            </TabsList>
            <TabsContent value="my-tweets" className="mt-4">
              <MyTweets />
            </TabsContent>
            <TabsContent value="following-tweets" className="mt-4">
              <div className="h-[calc(100vh-200px)] overflow-y-auto">
                {/* Placeholder content for following tweets */}
                <p>Following tweets will be displayed here.</p>
              </div>
            </TabsContent>
            <TabsContent value="global-tweets" className="mt-4">             
                <Global isLoading={false} />             
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}