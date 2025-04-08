'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Forum {
  id: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  _count?: {
    posts: number;
  };
  creator: {
    username: string;
    name: string;
  };
}

export default function ForumsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newForumData, setNewForumData] = useState({
    title: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('/api/forums');
      if (!response.ok) {
        throw new Error('Failed to fetch forums');
      }
      const data = await response.json();
      setForums(data);
    } catch (err) {
      setError('Failed to load forums');
      console.error('Error fetching forums:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForumData.title.trim() || !newForumData.description.trim() || creating) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForumData),
      });

      if (!response.ok) {
        throw new Error('Failed to create forum');
      }

      const forum = await response.json();
      setForums(prev => [forum, ...prev]);
      setNewForumData({ title: '', description: '' });
      router.push(`/forums/${forum.slug}`);
    } catch (err) {
      setError('Failed to create forum');
      console.error('Error creating forum:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Forums</h1>
        <p>Please sign in to view and create forums.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Forums</h1>
          <p className="text-neutral-content/60">Create or join discussions on various topics</p>
        </div>

        <form onSubmit={handleCreateForum} className="w-full md:w-auto">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={newForumData.title}
              onChange={(e) => setNewForumData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Forum title"
              className="input input-bordered w-full md:w-64"
              disabled={creating}
            />
            <input
              type="text"
              value={newForumData.description}
              onChange={(e) => setNewForumData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description"
              className="input input-bordered w-full md:w-96"
              disabled={creating}
            />
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={!newForumData.title.trim() || !newForumData.description.trim() || creating}
            >
              {creating ? 'Creating...' : 'Create Forum'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : forums.length === 0 ? (
        <div className="text-center py-8">
          <p>No forums yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {forums.map(forum => (
            <Link
              key={forum.id}
              href={`/forums/${forum.slug}`}
              className="card bg-base-200 hover:bg-base-300 transition-colors duration-200"
            >
              <div className="card-body">
                <h2 className="card-title">{forum.title}</h2>
                <p className="text-neutral-content/70">{forum.description}</p>
                <div className="flex justify-between items-center mt-4 text-sm text-neutral-content/60">
                  <span>Created by {forum.creator.username || forum.creator.name}</span>
                  <span>{forum._count?.posts || 0} posts</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}