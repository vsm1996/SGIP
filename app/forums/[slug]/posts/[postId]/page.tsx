'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ForumPost from '@/components/post/forum-post';

interface Forum {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface Post {
  id: string;
  message: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function ForumPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [forum, setForum] = useState<Forum | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug && params.postId) {
      fetchForumAndPost();
    }
  }, [params.slug, params.postId]);

  const fetchForumAndPost = async () => {
    try {
      const [forumResponse, postResponse] = await Promise.all([
        fetch(`/api/forums/${params.slug}`),
        fetch(`/api/forums/${params.slug}/posts/${params.postId}`)
      ]);

      if (!forumResponse.ok || !postResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [forumData, postData] = await Promise.all([
        forumResponse.json(),
        postResponse.json()
      ]);

      setForum(forumData);
      setPost(postData);
    } catch (err) {
      setError('Failed to load post');
      console.error('Error fetching post data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Forum Post</h1>
        <p>Please sign in to view forum posts.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !forum || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <p>{error || 'Post not found'}</p>
        </div>
        <div className="mt-4">
          <Link href={`/forums/${params.slug}`} className="btn btn-ghost">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/forums/${params.slug}`} className="btn btn-ghost btn-sm">
          ← Back to {forum.title}
        </Link>
      </div>

      <ForumPost
        post={post}
        forumSlug={params.slug as string}
        showComments={true}
      />
    </div>
  );
}