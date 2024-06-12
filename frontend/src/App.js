import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/login.jsx'
import Home from './pages/home.jsx'
import Scheduling from './pages/scheduling.jsx'
import Settings from './pages/settings.jsx';
import Instructors from './pages/instructors.jsx';
import Sections from './pages/sections.jsx';
import Subjects from './pages/subjects.jsx';
import Rooms from './pages/rooms.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/scheduling" element={<Scheduling/>}></Route>
        <Route path="/instructors" element={<Instructors/>}></Route>
        <Route path="/sections" element={<Sections/>}></Route>
        <Route path="/subjects" element={<Subjects/>}></Route>
        <Route path="/rooms" element={<Rooms/>}></Route>
        <Route path="/setting" element={<Settings/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
