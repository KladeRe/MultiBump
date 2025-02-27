import { PlayerInfo } from "../util/types";

export const connectToWebSocket = async (
  roomId: string,
  setIsConnected: (value: React.SetStateAction<boolean>) => void,
  worker: React.MutableRefObject<Worker>
) => {
  await new Promise<void>((resolve) => {
    const onConnect = (event: MessageEvent) => {
      if (event.data.type === "connected") {
        worker.current?.removeEventListener("message", onConnect);
        setIsConnected(true);
        resolve();
      }
    };
    worker.current?.addEventListener("message", onConnect);
    worker.current?.postMessage({ type: "connect", payload: "/api" });
  });

  worker.current?.postMessage({ type: "join", payload: roomId });
};

export const socketListen = async (
  setOpponentPosition: (value: React.SetStateAction<PlayerInfo | null>) => void,
  setLastActive: (value: React.SetStateAction<Date>) => void,
  worker: Worker,
): Promise<void> => {
  worker.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === "connected") {
      console.log("WebSocket connected");
    } else if (type === "message") {
      //console.log("Received message:", payload);
      const wsMessage = payload;
      if (wsMessage.x && wsMessage.y) {
        setOpponentPosition(() => ({
          x: wsMessage.x,
          y: wsMessage.y,
          dx: wsMessage.dx,
          dy: wsMessage.dy,
        }));
        setLastActive(new Date());
      }
    } else if (type === "disconnected") {
      console.log("WebSocket disconnected");
    } else if (type === "error") {
      console.log("WebSocket error:", payload);
    }
  };
};
