'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { SearchIcon, Heart, UserPlusIcon } from "lucide-react";
import Image from 'next/image';

interface Tweet {
  id: number;
  username: string;
  content: string;
  likes_count: number;
  image_url?: string;
  is_liked: boolean;
  is_following?: boolean; // Novo campo para rastrear se o usuário é seguido
}

interface GlobalProps {
  isLoading: boolean;
}

export default function Global({ isLoading }: GlobalProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isFollowingLoaded, setIsFollowingLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        // Obter tanto a lista de seguindo quanto os tweets em uma única chamada
        const [followingResponse, tweetsResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/user/following/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://127.0.0.1:8000/api/posts/ifollowing/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!followingResponse.ok || !tweetsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const followingData = await followingResponse.json();
        const tweetsData = await tweetsResponse.json();

        // Acessar a lista de usernames através da chave 'following'
        const followingList = followingData.following || [];
        setFollowing(followingList);
        setIsFollowingLoaded(true);

        const followingSet = new Set(followingList); // Para melhorar a performance

        setTweets(
          tweetsData.map((tweet: Tweet) => ({
            ...tweet,
            is_following: followingSet.has(tweet.username), // Verifica se o usuário está sendo seguido
          })).reverse()
        );

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
      setTweets(prevTweets =>
        prevTweets.map(t =>
          t.id === tweet.id
            ? { ...t, is_liked: !t.is_liked, likes_count: data.likes_count }
            : t
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleFollow = async (username: string) => {
    const token = localStorage.getItem('authToken');
    const endpoint = following.includes(username)
      ? `http://127.0.0.1:8000/api/user/unfollow/${username}/`
      : `http://127.0.0.1:8000/api/user/follow/${username}/`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }

      setFollowing(prev =>
        following.includes(username)
          ? prev.filter(name => name !== username)
          : [...prev, username]
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const renderTweet = (tweet: Tweet): JSX.Element => (
    <Card key={tweet.id} className="mb-4">
      <CardContent className="flex items-start space-x-4 pt-6">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={tweet.username} />
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{tweet.username}</p>
            <Button
              variant={tweet.is_following ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleFollow(tweet.username)}
              className={tweet.is_following ? 'bg-green-100 text-green-700' : ''}
            >
              {tweet.is_following ? (
                <>Seguindo</>
              ) : (
                <>
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Seguir
                </>
              )}
            </Button>
          </div>

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
              className={`transition-all duration-300 ease-in-out ${tweet.is_liked ? 'bg-red-100 border-red-300' : 'bg-background'}`}
              onClick={() => toggleLike(tweet)}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ease-in-out ${tweet.is_liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`}
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
          <p>Carregando...</p>
        ) : (
          filteredTweets.map(renderTweet)
        )}
      </div>
    </div>
  );
}
