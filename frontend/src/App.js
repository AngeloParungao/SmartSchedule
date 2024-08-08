import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PrivateRoute from './PrivateRoute';
import Login from './pages/login';
import Home from './pages/home';
import Draft from './pages/draft-schedules';
import Scheduling from './pages/scheduling';
import Settings from './pages/settings';
import Instructors from './pages/instructors';
import Sections from './pages/sections';
import Subjects from './pages/subjects';
import Rooms from './pages/rooms';
import ActivityLog from './pages/activityLogs';

function App() {

  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId) {
      const userTheme = localStorage.getItem(`theme-${userId}`);
      if (userTheme) {
          document.body.className = userTheme;
      }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/*<Route element={<PrivateRoute />}>*/}
          <Route path="/home" element={<Home />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/history" element={<ActivityLog />} />
        {/*</Route>*/}
      </Routes>
    </Router>
  );
}

export default App;
