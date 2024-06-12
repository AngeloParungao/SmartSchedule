import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx'
import Home from './pages/home.jsx'
import Scheduling from './pages/scheduling.jsx'
import Settings from './pages/settings.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/scheduling" element={<Scheduling/>}></Route>
        <Route path="/setting" element={<Settings/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
