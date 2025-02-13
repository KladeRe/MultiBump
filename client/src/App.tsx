import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import Game from './Game';
import Login from './Login';
import RoomMaker from './RoomMaker';
const App = () => {
  return (
    <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/create" element={<RoomMaker />}/>
        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;