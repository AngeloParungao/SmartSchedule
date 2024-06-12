import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/scheduling-navbar.css';

function Navbar(){
    return(
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
        </div>
    )
}

export default Navbar;