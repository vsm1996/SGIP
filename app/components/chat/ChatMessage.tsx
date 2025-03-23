'use client';

import { useState } from 'react';
import { timeAgo } from '@/app/utils';
import { nunito, raleway } from '@/app/utils/font';

interface Message {
  id: string;
  text: string;
  userId: string;
  username?: string;
  firstName?: string;
  createdAt: number;
  replyTo?: string;
  replyToMessage?: Message;
}

interface ChatMessageProps {
  message: Message;
  onReply: (messageId: string) => void;
  currentUserId?: string;
}

export default function ChatMessage({ message, onReply, currentUserId }: ChatMessageProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="relative group">
      {message.replyToMessage && (
        <div className="mb-2 pl-4 border-l-2 border-base-300">
          <div className="text-sm opacity-70">
            <span className="font-semibold">{message.replyToMessage.username || message.replyToMessage.firstName}</span>
            <span className="ml-2">{message.replyToMessage.text}</span>
          </div>
        </div>
      )}
      <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-base-200/10 transition-colors">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${raleway.className}`}>
              {message.username || message.firstName}
            </span>
            <span className="text-xs opacity-50">{timeAgo(message.createdAt)}</span>
          </div>
          <p className={`${nunito.className}`}>{message.text}</p>
        </div>
        <button
          onClick={() => onReply(message.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
          title="Reply to this message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}