'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/app/services/api-client';
import { CanceledError } from 'axios';

interface PostReactionButtonProps {
  session: any;
  postId: string;
  handleFetch: () => void;
}

type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

interface ReactionData {
  reactions: any[];
  groupedReactions: Record<string, any[]>;
  counts: Record<string, number>;
  total: number;
}

const reactionEmojis: Record<ReactionType, { emoji: string; label: string }> = {
  LIKE: { emoji: '👍', label: 'Like' },
  LOVE: { emoji: '❤️', label: 'Love' },
  HAHA: { emoji: '😂', label: 'Haha' },
  WOW: { emoji: '😮', label: 'Wow' },
  SAD: { emoji: '😢', label: 'Sad' },
  ANGRY: { emoji: '😡', label: 'Angry' },
};

const PostReactionButton = ({ session, postId, handleFetch }: PostReactionButtonProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);

  const fetchReactions = async () => {
    try {
      const res = await apiClient.get(`/post/${postId}/reaction`);
      setReactionData(res.data);

      // Check if the current user has reacted
      if (session) {
        const userReactions = res.data.reactions.filter((r: any) => r.userId === session.sub);
        if (userReactions.length > 0) {
          setUserReaction(userReactions[0].type as ReactionType);
        } else {
          setUserReaction(null);
        }
      }
    } catch (err) {
      if (err instanceof CanceledError) return;
      console.error('Error fetching reactions:', err);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReactions();
    }
  }, [postId, session]);

  const handleReaction = async (type: ReactionType) => {
    if (!session) return;

    try {
      await apiClient.post(`/post/${postId}/reaction`, {
        userId: session.sub,
        type
      });

      fetchReactions();
      handleFetch();
    } catch (err) {
      if (err instanceof CanceledError) return;
      console.error('Error reacting to post:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="flex items-center gap-1"
      >
        {userReaction ? (
          <span className="text-xl">{reactionEmojis[userReaction].emoji}</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:fill-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        )}
        <span>{reactionData?.total || 0}</span>
      </button>

      {showReactions && (
        <div className="absolute bottom-full mb-2 bg-base-300 rounded-lg p-2 shadow-lg z-10 flex gap-2">
          {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => (
            <button
              key={type}
              onClick={() => handleReaction(type as ReactionType)}
              className={`text-xl hover:scale-125 transition-transform ${userReaction === type ? 'scale-110' : ''}`}
              title={label}
            >
              {emoji}
              {reactionData?.counts?.[type] ? (
                <span className="text-xs block">{reactionData.counts[type]}</span>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostReactionButton;