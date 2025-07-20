'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/services/api-client';
import { CanceledError } from 'axios';
import Post from '@/components/post';
import Loading from '@/components/loading';
import ErrorMessage from '@/components/errorMessage';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import dynamic from "next/dynamic";

const DynamicPost = dynamic(() => import('@/components/post'), { ssr: false })

interface BookmarkedPost {
  id: string;
  post: {
    id: string;
    message: string;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
    likes: Array<{ userId: string }>;
    comments: Array<{ id: string }>;
    reactions: any[];
    isRichText?: boolean;
    content?: string;
  };
}

const BookmarksPage = () => {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErrorMessage] = useState<string[]>();

  const fetchBookmarks = async () => {
    if (!session?.sub) return;

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const res = await apiClient.get(`/bookmarks?userId=${session.sub}`);
      setBookmarks(res.data);
    } catch (err) {
      if (err instanceof CanceledError) return;
      console.error('Error fetching bookmarks:', err);
      if (err instanceof Error) {
        setErrorMessage([`Error fetching bookmarks: ${err.message}`]);
      } else {
        setErrorMessage(['Error fetching bookmarks']);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  const handleFetch = () => {
    fetchBookmarks();
  };

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Bookmarks</h2>
          <p className="text-base-content/70 mt-2">
            Please sign in to view your saved posts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookmarkIcon className="h-6 w-6" />
          Saved Bookmarks
        </h1>
        <p className="text-base-content/70">
          Posts you've saved for later
        </p>
      </div>

      {error && <ErrorMessage error={error} />}

      {isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 bg-base-200 rounded-lg">
              <h2 className="text-lg font-medium">No bookmarks yet</h2>
              <p className="text-base-content/70 mt-2">
                When you bookmark posts, they'll appear here for easy access
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-base-200 rounded-lg p-4">
                  <DynamicPost key={bookmark.id} post={bookmark.post} handleFetch={handleFetch} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;