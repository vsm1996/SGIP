import type * as Party from "partykit/server";

interface Message {
  id: string;
  text: string;
  userId: string;
  username?: string;
  firstName?: string;
  name?: string;
  image?: string;
  createdAt: number;
  replyTo?: string;
  replyToMessage?: Message;
}

interface RoomData {
  id: string;
  title: string;
  createdAt: Date;
  creatorId: string;
}

class ChatRoomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ChatRoomError';
  }
}

export default class ChatRoom implements Party.Server {
  private messages: Message[] = [];
  private roomData: RoomData | null = null;
  private storageKey = "messages";

  constructor(readonly party: Party.Party) { }

  private async loadMessages() {
    try {
      const storedMessages = await this.party.storage.get<Message[]>(this.storageKey);
      if (storedMessages) {
        this.messages = storedMessages;
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      this.messages = [];
    }
  }

  async onStart() {
    await this.loadMessages();
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    try {
      // Load room data from request headers
      const roomDataStr = ctx.request.headers.get('X-Room-Data');
      if (roomDataStr) {
        this.roomData = JSON.parse(roomDataStr);
      }

      // Send current state to the connecting client
      conn.send(JSON.stringify({
        type: "sync",
        roomData: this.roomData,
        messages: this.messages
      }));

    } catch (error) {
      console.error('Error in onConnect:', error);
      conn.send(JSON.stringify({
        type: "error",
        message: error instanceof ChatRoomError ? error.message : "Failed to initialize connection"
      }));
    }
  }

  async onMessage(message: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection) {
    try {
      if (typeof message !== 'string') {
        throw new ChatRoomError('Message must be a string', 'INVALID_MESSAGE_TYPE');
      }

      const data = JSON.parse(message);

      if (data.type === "message") {
        if (!data.userId || !data.text?.trim()) {
          throw new ChatRoomError('Invalid message data', 'INVALID_MESSAGE_DATA');
        }

        // If this is a reply, validate and find the parent message
        let replyToMessage: Message | undefined;
        if (data.replyTo) {
          replyToMessage = this.messages.find(m => m.id === data.replyTo);
          if (!replyToMessage) {
            throw new ChatRoomError('Reply target message not found', 'INVALID_REPLY_TARGET');
          }
        }

        // Create a new message object
        const newMessage: Message = {
          id: crypto.randomUUID(),
          text: data.text.trim(),
          userId: data.userId,
          username: data.username,
          firstName: data.firstName,
          createdAt: Date.now(),
          replyTo: data.replyTo,
          replyToMessage: replyToMessage
        };

        // Keep only the last 100 messages
        this.messages = [...this.messages, newMessage].slice(-100);

        // Save to PartyKit storage
        await this.party.storage.put(this.storageKey, this.messages);

        // Broadcast to all connections
        this.party.broadcast(JSON.stringify({
          type: "message",
          message: newMessage
        }));
      }
    } catch (error) {
      console.error("Error processing message:", error);
      sender.send(JSON.stringify({
        type: "error",
        message: error instanceof ChatRoomError ? error.message : "Failed to process message"
      }));
    }
  }
}

ChatRoom satisfies Party.Worker;
