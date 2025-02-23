import { Coordinates2D, PlayerInfo } from "./util/types";
import { Stage, Graphics } from "@pixi/react";

const Renderer = (
  {
    roomId,
    playArea,
    isDragging,
    playerPosition,
    lineEnd,
    playerRadius,
    opponentPosition,
  } : {
    roomId: string,
    playArea: Coordinates2D,
    isDragging: React.MutableRefObject<boolean>,
    playerPosition: PlayerInfo,
    lineEnd: Coordinates2D,
    playerRadius: number,
    opponentPosition?: PlayerInfo | null,
  }
) => {

  return (
      <div className="container">
        <div className="stage-wrapper">
          <h1 className="left">Room Id: {roomId}</h1>
          <Stage
            width={playArea.x}
            height={playArea.y}
            options={{ background: 0x1099bb }}
          >
            {isDragging.current && (
              <Graphics
                draw={(g) => {
                  g.clear();
                  g.lineStyle(2, 0x000000);
                  g.moveTo(playerPosition.x, playerPosition.y);
                  g.lineTo(lineEnd.x, lineEnd.y);
                }}
              />
            )}
            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xff0000);
                g.drawCircle(playerPosition.x, playerPosition.y, playerRadius);
                if (opponentPosition) {
                  g.beginFill(0x006400);
                  g.drawCircle(opponentPosition.x, opponentPosition.y, playerRadius);
                }
                g.endFill();
              }}
            />
          </Stage>
          <h1 className="right">Score</h1>
        </div>

      </div>

    );
}

export default Renderer;