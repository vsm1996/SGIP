import type * as Party from "partykit/server";

import type { Discussion } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) { }

  discussion: Discussion | undefined

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const discussion = (await req.json()) as Discussion;
      this.discussion = { ...discussion }
    }

    if (this.discussion) {
      return new Response(JSON.stringify(this.discussion), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response("Not found", { status: 404 })
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
