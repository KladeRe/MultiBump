import { Stage, Graphics } from '@pixi/react';
import { useState, useEffect, useRef } from 'react';

const Game = () => {

  const [screenWidth] = useState<number>(window.innerWidth);
  const [screenHeight] = useState<number>(window.innerHeight);

  const playerRadius = 25;

  const [playerX, setPlayerX] = useState<number>(screenWidth / 2);
  const [playerY, setPlayerY] = useState<number>((screenHeight * 3) / 4);

  const [opponentX, setOpponentX] = useState<number>(screenWidth / 2);
  const [opponentY, setOpponentY] = useState<number>(screenHeight / 4);

  const [velocityX, setVelocityX] = useState<number>(0);
  const [velocityY, setVelocityY] = useState<number>(0);

  const [lineEnd, setLineEnd] = useState({ x: playerX, y: playerY });

  const initialMousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef<boolean>(false);

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    worker.current = new Worker(new URL('./socket-worker.ts', import.meta.url));
    worker.current.postMessage({ type: 'connect', payload: '/api' });
    worker.current.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'connected') {
        console.log('WebSocket connected');
      } else if (type === 'message') {
        console.log('Received message:', payload);
        const wsMessage = JSON.parse(payload);
        if (wsMessage.x && wsMessage.y) {
          setOpponentX(wsMessage.x);
          setOpponentY(wsMessage.y);
        }
      } else if (type === 'disconnected') {
        console.log('WebSocket disconnected');
      } else if (type === 'error') {
        console.error('WebSocket error:', payload);
      }
    };

    return () => {
      worker.current?.postMessage({ type: 'close' });
      worker.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const stageElement = event.currentTarget as HTMLElement;
      const boundingRect = stageElement.getBoundingClientRect();
      const mouseX = event.clientX - boundingRect.left;
      const mouseY = event.clientY - boundingRect.top;
      const dx = mouseX - playerX;
      const dy = mouseY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius) {
        isDragging.current = true;
        initialMousePos.current = { x: mouseX, y: mouseY };
      }

      setLineEnd({ x: playerX, y: playerY });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging.current) {
        const stageElement = document.querySelector('canvas');
        const boundingRect = stageElement?.getBoundingClientRect();
        const mouseX = event.clientX - (boundingRect?.left ?? 0);
        const mouseY = event.clientY - (boundingRect?.top ?? 0);

        const dx = mouseX - initialMousePos.current.x;
        const dy = mouseY - initialMousePos.current.y;

        setVelocityX(dx * -0.7); // Adjust the multiplier to control the speed
        setVelocityY(dy * -0.7); // Adjust the multiplier to control the speed
        isDragging.current = false;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging.current) {
        const stageElement = document.querySelector('canvas');
        const boundingRect = stageElement?.getBoundingClientRect();
        const mouseX = event.clientX - (boundingRect?.left ?? 0);
        const mouseY = event.clientY - (boundingRect?.top ?? 0);
        setLineEnd({ x: playerX + (playerX-mouseX), y: playerY + (playerY-mouseY) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    const stageElement = document.querySelector('canvas');
    stageElement?.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      stageElement?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [playerX, playerY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerX((prevX) => {
        const nextX = prevX + velocityX;
        if (nextX <= playerRadius || nextX >= screenWidth - playerRadius) {
          setVelocityX(velocityX * -0.8); // Bounce with 80% energy retention
        }
        return Math.min(Math.max(nextX, playerRadius), screenWidth - playerRadius);
      });
      setPlayerY((prevY) => {
        const nextY = prevY + velocityY;
        if (nextY <= playerRadius || nextY >= screenHeight - playerRadius) {
          setVelocityY(velocityY * -0.8); // Bounce with 80% energy retention
        }
        return Math.min(Math.max(nextY, playerRadius), screenHeight - playerRadius);
      });
      setVelocityX((prevVx) => prevVx * 0.9); // Apply friction
      setVelocityY((prevVy) => prevVy * 0.9); // Apply friction
      // Only send if position changed significantly
      const positionThreshold = 1;
      if (Math.abs(velocityX) > positionThreshold || Math.abs(velocityY) > positionThreshold) {
        worker.current?.postMessage({ type: 'send', payload: { x: screenWidth - playerX, y: screenHeight - playerY } });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [playerX, playerY, screenHeight, screenWidth, velocityX, velocityY]);

  return (
    <Stage width={screenWidth} height={screenHeight} options={{ background: 0x1099bb }}>
      { isDragging.current &&
      <Graphics
        draw={(g) => {
          g.clear();
          // Draw the line
          g.lineStyle(2, 0x000000);
          g.moveTo(playerX, playerY);
          g.lineTo(lineEnd.x, lineEnd.y);

        }}
      />
      }
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xff0000);
          g.drawCircle(playerX, playerY, playerRadius);
          g.beginFill(0x006400);
          g.drawCircle(opponentX, opponentY, playerRadius);
          g.endFill();
        }}
      />
    </Stage>
  );
};

export default Game;