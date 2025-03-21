import type * as Party from "partykit/server";

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default class ChatRoom implements Party.Server {
  constructor(readonly party: Party.Party) { }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    try {
      // Send last 50 messages when someone connects
      const messages = await this.party.storage.get<Message[]>("messages") || [];
      conn.send(JSON.stringify({ type: "sync", messages }));
    } catch (error) {
      console.error("Error in onConnect:", error);
      conn.send(JSON.stringify({ type: "error", message: "Failed to load messages" }));
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      const data = JSON.parse(message);

      if (data.type === "message") {
        // Validate required fields
        if (!data.text?.trim() || !data.userId || !data.username) {
          throw new Error("Missing required fields");
        }

        // Validate message length
        if (data.text.length > 1000) {
          throw new Error("Message too long");
        }

        const messages = await this.party.storage.get<Message[]>("messages") || [];
        const newMessage: Message = {
          id: crypto.randomUUID(),
          text: data.text.trim(),
          userId: data.userId,
          username: data.username,
          createdAt: Date.now(),
        };

        // Keep only last 50 messages
        const updatedMessages = [...messages, newMessage].slice(-50);
        await this.party.storage.put("messages", updatedMessages);

        // Broadcast to all connections
        this.party.broadcast(
          JSON.stringify({ type: "message", message: newMessage }),
          []
        );
      }
    } catch (error) {
      console.error("Error in onMessage:", error);
      sender.send(JSON.stringify({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to process message"
      }));
    }
  }
} 