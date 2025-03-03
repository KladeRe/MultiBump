import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './RoomMaker.css';

const RoomMaker = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(Math.round(window.innerWidth * 0.75));
  const [height, setHeight] = useState<number>(Math.round(window.innerHeight * 0.75));

  const [singlePlayer, setSinglePlayer] = useState<boolean>(false);

  const [playerColor, setPlayerColor] = useState<string>('#ff0000');

  const [opponentColor, setOpponentColor] = useState<string>('#006400');

  const [backgroundColor, setBackgroundColor] = useState<string>('#1099bb');



  const handlePlayerColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerColor(event.target.value);
  };

  const handleOpponentColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentColor(event.target.value);
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };

  const backToLogin = () => {
    navigate("/login");
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(event.target.value));
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(event.target.value));
  }

  const createRoom = () => {
    const str1 = (width*4).toString().padStart(4, '0');
    const str2 = (height*4).toString().padStart(4, '0');


    const random = Math.floor(1000 + Math.random() * 9000).toString();

    if (singlePlayer == true) {
      navigate(`/simulation?room=${window.btoa(str1).replace(/=+$/, '')}-${window.btoa(str2).replace(/=+$/, '')}-${window.btoa(random).replace(/=+$/, '')}`);
    } else {
      navigate(`/game?room=${window.btoa(str1).replace(/=+$/, '')}-${window.btoa(str2).replace(/=+$/, '')}-${window.btoa(random).replace(/=+$/, '')}`);
    }


  }
  return (
    <div>
      <h1>Room creator</h1>

      <div className="switch-container">
        <span className="slider-value">Single Player</span>
        <div className="button r" id="button-3">
          <input
            type="checkbox"
            className="checkbox"
            checked={singlePlayer}
            onChange={(e) => setSinglePlayer(e.target.checked)}
          />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
      </div>
      <div className="color-selector-container">
        <div className="color-picker">
          <p>Player color</p>
          <input
            type="color"
            value={playerColor}
            onChange={handlePlayerColorChange}
            className="color-input"
          />
        </div>
        <div className="color-picker">
          <p>Opponent color</p>
          <input
            type="color"
            value={opponentColor}
            onChange={handleOpponentColorChange}
            className="color-input"
          />
        </div>
        <div className="color-picker">
          <p>Background color</p>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="color-input"
          />
        </div>

      </div>



      <div className="slider-container">
        <span className="slider-value">Width: {width}</span>
        <input
          type="range"
          id="slider"
          min={Math.round(window.innerWidth * 0.5)}
          max={Math.round(window.innerWidth)}
          value={width}
          onChange={handleWidthChange}
          className="slider"
        />

        <span className="slider-value">Height: {height}</span>

        <input
          type="range"
          id="slider"
          min={Math.round(window.innerHeight * 0.5)}
          max={Math.round(window.innerHeight)}
          value={height}
          onChange={handleHeightChange}
          className="slider"
        />
      </div>
      <div className="button-container">
        <button onClick={createRoom}>Create Room</button>
        <button onClick={backToLogin}>Back to room login</button>
      </div>
    </div>
  );
};

export default RoomMaker;
