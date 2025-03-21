import type * as Party from "partykit/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Message {
  id: string;
  text: string;
  userId: string;
  username?: string;
  firstName?: string;
  createdAt: number;
}

interface RoomData {
  id: string;
  title: string;
  createdAt: Date;
  creatorId: string;
}

export default class ChatRoom implements Party.Server {
  roomData: RoomData | null = null;
  messages: Message[] = [];

  constructor(readonly party: Party.Party) { }

  async onStart() {
    try {
      // Load room data and messages from database
      const room = await prisma.discussionRoom.findUnique({
        where: { id: this.party.id },
        include: {
          messages: {
            include: {
              author: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      if (room) {
        this.roomData = {
          id: room.id,
          title: room.title,
          createdAt: room.createdAt,
          creatorId: room.creatorId
        };

        this.messages = room.messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          userId: msg.authorId,
          username: msg.author.username || undefined,
          firstName: msg.author.firstName || undefined,
          createdAt: msg.createdAt.getTime()
        }));
      }
    } catch (error) {
      console.error('Error loading room data:', error);
    }
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    try {
      // Get room data
      const roomData = await prisma.discussionRoom.findUnique({
        where: { id: this.party.id },
        include: {
          messages: {
            include: {
              author: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      if (!roomData) {
        conn.send(JSON.stringify({
          type: "error",
          message: "Room not found"
        }));
        return;
      }

      // Get user ID from headers
      const userId = ctx.request.headers.get('X-User-ID');
      if (userId) {
        // Add user to participants if not already present
        await prisma.discussionRoom.update({
          where: { id: this.party.id },
          data: {
            participants: {
              connect: {
                id: userId
              }
            }
          }
        });
      }

      // Format messages
      const messages = roomData.messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        userId: msg.authorId,
        username: msg.author.username || undefined,
        firstName: msg.author.firstName || undefined,
        createdAt: msg.createdAt.getTime()
      }));

      // Send initial data
      conn.send(JSON.stringify({
        type: "sync",
        roomData: {
          id: roomData.id,
          title: roomData.title,
          createdAt: roomData.createdAt
        },
        messages
      }));

    } catch (error) {
      console.error('Error in onConnect:', error);
      conn.send(JSON.stringify({
        type: "error",
        message: "Failed to initialize room"
      }));
    }
  }

  async onMessage(message: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection) {
    try {
      if (typeof message !== 'string') {
        throw new Error('Message must be a string');
      }

      const data = JSON.parse(message);

      if (data.type === "message") {
        const userId = data.userId;
        if (!userId) {
          throw new Error('User ID is required');
        }

        // Get user data
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Save message to database
        const savedMessage = await prisma.message.create({
          data: {
            text: data.text,
            authorId: userId,
            roomId: this.party.id
          },
          include: {
            author: true
          }
        });

        // Format message for broadcast
        const newMessage = {
          id: savedMessage.id,
          text: savedMessage.text,
          userId: savedMessage.authorId,
          username: user.username || undefined,
          firstName: user.firstName || undefined,
          createdAt: savedMessage.createdAt.getTime()
        };

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
        message: "Failed to process message"
      }));
    }
  }
}

ChatRoom satisfies Party.Worker;
