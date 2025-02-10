export const connectToWebSocket = async (roomId: string, setIsConnected: (value: React.SetStateAction<boolean>) => void, worker: React.MutableRefObject<Worker>) => {
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