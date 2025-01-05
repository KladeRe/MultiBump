import { Stage } from '@pixi/react';
import { useState, useEffect, useRef } from 'react';
import { Graphics } from '@pixi/react';

const Game = () => {
  const [rectX, setRectX] = useState(100);
  const [rectY, setRectY] = useState(100);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const screenWidth = 1000;
  const screenHeight = 800;
  const playerWidth = 25;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setRectX((prevX) => Math.min(prevX + 10, screenWidth - playerWidth));
      } else if (event.key === 'ArrowLeft') {
        setRectX((prevX) => Math.max(prevX - 10, playerWidth));
      } else if (event.key === 'ArrowUp') {
        setRectY((prevY) => Math.max(prevY - 10, playerWidth));
      } else if (event.key === 'ArrowDown') {
        setRectY((prevY) => Math.min(prevY + 10, screenHeight - playerWidth));
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      const stageElement = event.currentTarget as HTMLElement;
      const boundingRect = stageElement.getBoundingClientRect();
      const mouseX = event.clientX - boundingRect.left;
      const mouseY = event.clientY - boundingRect.top;
      const dx = mouseX - rectX;
      const dy = mouseY - rectY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerWidth) {
        isDragging.current = true;
        initialMousePos.current = { x: mouseX, y: mouseY };
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging.current) {
        const stageElement = event.currentTarget as HTMLElement;
        const boundingRect = stageElement.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left;
        const mouseY = event.clientY - boundingRect.top;
        const dx = mouseX - initialMousePos.current.x;
        const dy = mouseY - initialMousePos.current.y;

        setVelocityX(dx * -0.9); // Adjust the multiplier to control the speed
        setVelocityY(dy * -0.9); // Adjust the multiplier to control the speed
        isDragging.current = false;
      }
    };

    const stageElement = document.querySelector('canvas');
    stageElement?.addEventListener('mousedown', handleMouseDown);

    stageElement?.addEventListener('mouseup', handleMouseUp);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stageElement?.removeEventListener('mousedown', handleMouseDown);
      stageElement?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [rectX, rectY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRectX((prevX) => Math.min(Math.max(prevX + velocityX, playerWidth), screenWidth - playerWidth));
      setRectY((prevY) => Math.min(Math.max(prevY + velocityY, playerWidth), screenHeight - playerWidth));
      setVelocityX((prevVx) => prevVx * 0.95); // Apply friction
      setVelocityY((prevVy) => prevVy * 0.95); // Apply friction

    }, 16);

    return () => clearInterval(interval);
  }, [velocityX, velocityY]);

  return (
    <Stage width={screenWidth} height={screenHeight} options={{ background: 0x1099bb }}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xff0000);
          g.drawCircle(rectX, rectY, playerWidth);
          g.endFill();
        }}
      />
    </Stage>
  );
};

export default Game;