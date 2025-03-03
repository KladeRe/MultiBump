import { Coordinates2D, PlayerInfo } from "./types";
import { Stage, Graphics } from "@pixi/react";
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const backToHome = () => {
    navigate("/login");
  }

  return (
      <div className="container">
        <div className="stage-wrapper">

          <div className="stage">
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
          </div>


        </div>
        <div className="middle_in_center">

          <h1 className="left">Room Id: {roomId}</h1>

          <button className="button-warning" onClick={backToHome}>Exit game</button>

          <h1 className="right">Player scores: 0/0</h1>
        </div>



      </div>

    );
}

export default Renderer;