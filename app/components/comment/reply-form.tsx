'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { nunito } from '@/app/utils/font';

interface ReplyFormProps {
  commentId: string;
  postId: string;
  onReplySubmit: () => void;
  onCancel: () => void;
}

export default function ReplyForm({ commentId, postId, onReplySubmit, onCancel }: ReplyFormProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session?.user) return;

    try {
      setIsSubmitting(true);
      setError([]);

      const response = await fetch(`/api/post/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          userId: session.sub,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to post reply');
      }

      setMessage('');
      onReplySubmit();
    } catch (err: any) {
      setError([err.message || 'An error occurred while posting reply']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a reply..."
            className={`textarea textarea-bordered w-full ${nunito.className}`}
            rows={3}
            maxLength={1000}
            disabled={isSubmitting}
          />
        </div>
        {error.length > 0 && (
          <div className="alert alert-error">
            <ul className="list-disc list-inside">
              {error.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}