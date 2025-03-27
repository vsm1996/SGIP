'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/app/services/api-client';
import { CanceledError } from 'axios';
import Post from '../components/post';
import Loading from '../components/loading';
import ErrorMessage from '../components/errorMessage';

interface BookmarkedPost {
  id: string;
  post: any;
}

const BookmarksPage = () => {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErrorMessage] = useState<string[]>();

  const fetchBookmarks = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const res = await apiClient.get(`/bookmarks?userId=${session.sub}`);
      setBookmarks(res.data);
    } catch (err) {
      if (err instanceof CanceledError) return;
      console.error('Error fetching bookmarks:', err);
      setErrorMessage(['Error fetching bookmarks']);
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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
        <p>Please sign in to view your bookmarks</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex-1 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>

      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}

      {!isLoading && bookmarks.length === 0 && (
        <div className="card bg-base-200 p-6 text-center">
          <p>You haven't bookmarked any posts yet.</p>
          <p className="mt-2 text-sm opacity-70">When you bookmark posts, they'll appear here.</p>
        </div>
      )}

      <ul className="flex flex-col">
        {bookmarks.map((bookmark) => (
          <Post key={bookmark.id} post={bookmark.post} handleFetch={handleFetch} />
        ))}
      </ul>
    </div>
  );
};

export default BookmarksPage;