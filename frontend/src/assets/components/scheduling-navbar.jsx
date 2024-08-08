import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../../css/scheduling-navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSelectChange = (event) => {
        navigate(event.target.value);
    };

    return (
        <div className='navbar'>
            <span>Scheduling</span>
            <div className='navigation'>
                <NavLink exact to="/scheduling">
                    Schedule
                </NavLink>
                <NavLink to="/instructors">
                    Instructors
                </NavLink>
                <NavLink to="/sections">
                    Sections
                </NavLink>
                <NavLink to="/subjects">
                    Subjects
                </NavLink>
                <NavLink to="/rooms">
                    Rooms
                </NavLink>
            </div>
            <div className='navigation-small-screen'>
                <select value={location.pathname} onChange={handleSelectChange}>
                    <option value="/scheduling">Scheduling</option>
                    <option value="/instructors">Instructors</option>
                    <option value="/sections">Sections</option>
                    <option value="/subjects">Subjects</option>
                    <option value="/rooms">Rooms</option>
                </select>
            </div>
        </div>
    );
}

export default Navbar;
