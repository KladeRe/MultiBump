import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RoomMaker = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(Math.round(window.innerWidth * 0.75));
  const [height, setHeight] = useState<number>(Math.round(window.innerHeight * 0.75));

  const backToLogin = () => {
    navigate("/login");
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(event.target.value));
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(event.target.value));
  }
  return (
    <div>
      <h1>Room creator</h1>
      <p>Coming soon!</p>
      <button onClick={backToLogin}>Back to room login</button>
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
      </div>

      <div className="slider-container">
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
    </div>
  );
};

export default RoomMaker;
