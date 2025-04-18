import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5228 });
interface Position {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const PING_INTERVAL = 100000;

const heartbeat = (client: WebSocket) => {
  (client as any).isAlive = true;
};

interface RoomParticipants {
  [key: string]: Set<WebSocket>;
}

const rooms: RoomParticipants = {};

wss.on("connection", (ws: WebSocket) => {
  let currentRoom: string | null = null;

  (ws as any).isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", heartbeat);

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.type == "position") {
        const playerPosition: Position = data.payload;
        if (
          typeof playerPosition.x === "number" &&
          typeof playerPosition.y === "number" &&
          typeof playerPosition.dy === "number"
        ) {
          wss.clients.forEach((client) => {
            if (
              client !== ws &&
              client.readyState === WebSocket.OPEN &&
              currentRoom &&
              rooms[currentRoom].has(client)
            ) {
              client.send(
                JSON.stringify({ type: "coordinates", payload: playerPosition })
              );
            }
          });
        } else {
          ws.send("Invalid coordinates");
        }
      } else if (data.type == "join") {
        const room = data.payload;
        if (rooms[room] && rooms[room].size >= 2) {
          ws.send(
            JSON.stringify({ type: "roomFull", payload: "Room is full" })
          );
          return;
        }
        if (!rooms[room]) {
          rooms[room] = new Set();
        }
        if (!rooms[room].has(ws)) {
          rooms[room].add(ws);
          currentRoom = room;
          if (rooms[room].size == 2) {
            rooms[room].forEach((client) =>
              client.send(JSON.stringify({ type: "allJoined", payload: room }))
            );
            return;
          }
        }

        ws.send(JSON.stringify({ type: "joined", payload: room }));
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      ws.send(JSON.stringify({ type: "error", payload: errorMessage }));
    }
  });
  ws.on("close", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].delete(ws);
      if (rooms[currentRoom].size === 0) {
        delete rooms[currentRoom];
      } else {
        rooms[currentRoom].forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "opponentLeft",
                payload: "Opponent has left the room",
              })
            );
          }
        });
      }
    }
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if ((ws as any).isAlive === false) {
      Object.keys(rooms).forEach((room) => {
        if (rooms[room].has(ws)) {
          rooms[room].delete(ws);
          if (rooms[room].size === 0) {
            delete rooms[room];
          }
        }
      });
      return ws.terminate();
    }

    (ws as any).isAlive = false;
    ws.ping();
  });
}, PING_INTERVAL);

wss.on("close", () => {
  clearInterval(interval);
});
