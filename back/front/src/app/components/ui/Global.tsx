'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { SearchIcon, Heart } from "lucide-react";
import Image from 'next/image';

interface Tweet {
  id: number;
  username: string;
  content: string;
  likes_count: number;
  image_url?: string;
  is_liked: boolean; // Campo para rastrear se o tweet foi curtido
}

interface GlobalProps {
  isLoading: boolean;
}

export default function Global({ isLoading }: GlobalProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://127.0.0.1:8000/api/posts/all/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Inverte a ordem dos tweets
        setTweets(data.map((tweet: Tweet) => ({ ...tweet })).reverse()); // Inverte a lista aqui
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
      }
    };

    fetchTweets();
  }, []);


  useEffect(() => {
    setFilteredTweets(tweets);
  }, [tweets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = tweets.filter(tweet =>
      tweet.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tweet.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTweets(filtered);
  };

  const toggleLike = async (tweet: Tweet) => {
    const token = localStorage.getItem('authToken');
    const endpoint = tweet.is_liked
      ? `http://127.0.0.1:8000/api/posts/${tweet.id}/unlike/`
      : `http://127.0.0.1:8000/api/posts/${tweet.id}/like/`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      // Atualiza o estado com base na resposta da API
      setTweets(prevTweets =>
        prevTweets.map(t =>
          t.id === tweet.id
            ? { ...t, is_liked: !t.is_liked, likes_count: data.likes_count } // Atualiza is_liked e likes_count
            : t
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderTweet = (tweet: Tweet): JSX.Element => (
    <Card key={tweet.id} className="mb-4">
      <CardContent className="flex items-start space-x-4 pt-6">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={tweet.username} />
        </Avatar>
        <div className="flex-grow">
          <div><p className="font-semibold">{tweet.username}</p> </div>
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
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
             
              <Button
                variant="outline"
                size="icon"
                className={`transition-all duration-300 ease-in-out ${tweet.is_liked ? 'bg-red-100 border-red-300' : 'bg-background'
                  }`} 
                  onClick={() => toggleLike(tweet)}               
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-300 ease-in-out ${tweet.is_liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'
                    }`}
                />
                <span className="sr-only">Curtir</span>
              </Button>
              <span>{tweet.likes_count}</span>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="mb-4">
        <Label htmlFor="search-users" className="sr-only">Search Users or Tweets</Label>
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="search-users"
            type="text"
            placeholder="Search users or tweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>
      <div className="h-[calc(100vh-250px)] overflow-y-auto space-y-4">
        {isLoading ? (
          <p className="text-center">Loading global tweets...</p>
        ) : filteredTweets.length > 0 ? (
          filteredTweets.map(renderTweet)
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}
