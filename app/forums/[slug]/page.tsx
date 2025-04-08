'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ForumPost from '@/app/components/post/forum-post';

interface Forum {
  id: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  creator: {
    username: string;
    name: string;
  };
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

export default function ForumPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchForumAndPosts();
    }
  }, [params.slug]);

  const fetchForumAndPosts = async () => {
    try {
      const [forumResponse, postsResponse] = await Promise.all([
        fetch(`/api/forums/${params.slug}`),
        fetch(`/api/forums/${params.slug}/posts`)
      ]);

      if (!forumResponse.ok || !postsResponse.ok) {
        throw new Error('Failed to fetch forum data');
      }

      const [forumData, postsData] = await Promise.all([
        forumResponse.json(),
        postsResponse.json()
      ]);

      setForum(forumData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to load forum');
      console.error('Error fetching forum data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || creating) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/forums/${params.slug}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Forum</h1>
        <p>Please sign in to view and participate in forums.</p>
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

  if (!forum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <p>Forum not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/forums" className="btn btn-ghost btn-sm">
            ← Back to Forums
          </Link>
        </div>
        <div className='flex flex-col items-center justify-center'>

          <h1 className="text-3xl font-bold uppercase">{forum.title}</h1>
          <p className="text-neutral-content/70">{forum.description}</p>
        </div>
      </div>

      <div className="mb-8">
        <form onSubmit={handleCreatePost} className="card bg-base-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Create a New Post</h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Post title"
                className="input input-bordered w-full"
                disabled={creating}
              />
            </div>
            <div>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here..."
                className="textarea textarea-bordered w-full h-32"
                disabled={creating}
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newPost.title.trim() || !newPost.content.trim() || creating}
              >
                {creating ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p>No posts yet. Be the first to create a post!</p>
          </div>
        ) : (
          posts.map(post => (
            <ForumPost
              key={post.id}
              post={post}
              forumSlug={params.slug as string}
            />
          ))
        )}
      </div>
    </div>
  );
}