'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  text: string;
  userId: string;
  username?: string;
  firstName?: string;
  createdAt: Date;
  replyTo?: string;
  replyToMessage?: Message;
}

interface ChatProps {
  roomId: string;
  onError?: (error: string) => void;
}

export default function Chat({ roomId, onError }: ChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    text: string;
    username: string;
  } | null>(null);

  const handleReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyTo({
        id: message.id,
        text: message.text,
        username: message.username || message.firstName || 'Unknown'
      });
    }
  };

  const handleSendMessage = (text: string, replyToId?: string) => {
    if (!session?.user) return;

    const messageData = {
      type: 'message',
      text,
      userId: session.sub!,
      username: session.user.name,
      firstName: session.user.firstName,
      replyTo: replyToId
    };

    // Send message to PartyKit server
    // Implementation depends on your PartyKit client setup
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            onReply={handleReply}
            currentUserId={session?.sub}
          />
        ))}
      </div>
      <div className="p-4 border-t border-base-300">
        <ChatInput
          onSendMessage={handleSendMessage}
          replyTo={replyTo || undefined}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}