import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx'
import Home from './pages/home.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
