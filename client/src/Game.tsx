import { BlurFilter, TextStyle } from 'pixi.js';
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { Graphics } from '@pixi/react';

const Game = () => {
  const [rectX, setRectX] = useState(0);
  const [rectY, setRectY] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setRectX((prevX) => (prevX + 10) % 800);
      } else if (event.key === 'ArrowLeft') {
        setRectX((prevX) => (prevX - 10 + 800) % 800);
      } else if (event.key === 'ArrowUp') {
        setRectY((prevY) => (prevY - 10 + 600) % 600);
      } else if (event.key === 'ArrowDown') {
        setRectY((prevY) => (prevY + 10) % 600);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const blurFilter = useMemo(() => new BlurFilter(2), []);
  const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png';

  return (
    <Stage width={1000} height={800} options={{ background: 0x1099bb }}>
      <Sprite image={bunnyUrl} x={300} y={150} />
      <Sprite image={bunnyUrl} x={500} y={150} />
      <Sprite image={bunnyUrl} x={400} y={200} />

      <Container x={200} y={200}>
        <Text
          text="Hello World"
          anchor={0.5}
          x={220}
          y={150}
          filters={[blurFilter]}
          style={
            new TextStyle({
              align: 'center',
              fill: '0xffffff',
              fontSize: 50,
              letterSpacing: 20,
              dropShadow: true,
              dropShadowColor: '#E72264',
              dropShadowDistance: 6,
            })
          }
        />
      </Container>

      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xff0000);
          g.drawRect(rectX, rectY, 100, 100);
          g.endFill();
        }}
      />
    </Stage>
  );
};

export default Game;