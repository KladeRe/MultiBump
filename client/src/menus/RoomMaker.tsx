import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RoomMaker.css";

const RoomMaker = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(
    Math.round(window.innerWidth * 0.75)
  );
  const [height, setHeight] = useState<number>(
    Math.round(window.innerHeight * 0.75)
  );

  const [singlePlayer, setSinglePlayer] = useState<boolean>(false);

  const backToLogin = () => {
    navigate("/login");
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(event.target.value));
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(event.target.value));
  };

  const createRoom = () => {
    const widthEncoding = (width * 4).toString().padStart(4, "0");
    const heightEncoding = (height * 4).toString().padStart(4, "0");

    const random = Math.floor(1000 + Math.random() * 9000).toString();

    const gameID = `${window.btoa(widthEncoding).replace(/=+$/, "")}-${window
      .btoa(heightEncoding)
      .replace(/=+$/, "")}`;

    if (singlePlayer == true) {
      navigate(`/simulation?room=${gameID}`);
    } else {
      navigate(
        `/game?room=${gameID}-${window.btoa(random).replace(/=+$/, "")}`
      );
    }
  };
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
