let socketWorker: Worker | null = null;

export const getSocketWorker = () => {
  if (!socketWorker) {
    socketWorker = new Worker(
      new URL("./../background/socket-worker.ts", import.meta.url)
    );
  }
  return socketWorker;
};

export const terminateSocketWorker = () => {
  if (socketWorker) {
    socketWorker.terminate();
    socketWorker = null;
  }
};
