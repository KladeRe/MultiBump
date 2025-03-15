import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import Game from "./games/Game";
import Loader from "./games/Loader";
import Login from "./menus/Login";
import RoomMaker from "./menus/RoomMaker";
import RoomFull from "./menus/RoomFull";
import Simulation from "./games/Simulation";
import Spinner from "./util/Spinner";
const App = () => {
  return (
    <Routes>
      <Route path="/game" element={<Game />} />
      <Route path="/loader" element={<Loader />} />
      <Route path="/login" element={<Login />} />
      <Route path="/fullRoom" element={<RoomFull />} />
      <Route path="/create" element={<RoomMaker />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/spinner" element={<Spinner />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
