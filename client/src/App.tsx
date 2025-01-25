import './App.css';

import { Routes, Route } from 'react-router-dom';
import Game from './Game';
import Login from './Login';
const App = () => {
  return (
    <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<Login />}/>
    </Routes>
  );
};

export default App;