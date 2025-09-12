'use client';

import { useState } from 'react';
import { nunito } from '@/utils/font';

interface ChatInputProps {
  onSendMessage: (text: string, replyTo?: string) => void;
  replyTo?: {
    id: string;
    text: string;
    username: string;
  };
  onCancelReply?: () => void;
}

export default function ChatInput({ onSendMessage, replyTo, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message.trim(), replyTo?.id);
    setMessage('');
  };

  return (
    <div className="w-full">
      {replyTo && (
        <div className="mb-2 p-2 bg-base-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">Replying to</span>
            <span className="font-semibold">{replyTo.username}</span>
            <span className="text-sm opacity-70 truncate">{replyTo.text}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="btn btn-ghost btn-sm"
            title="Cancel reply"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={`input input-bordered flex-grow ${nunito.className}`}
          maxLength={1000}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}