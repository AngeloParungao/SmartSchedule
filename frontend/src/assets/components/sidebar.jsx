import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../../css/sidebar.css';
import logo from '../images/logo_white_no_bg 2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome , faCalendar , faBell, faGear, faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

function Sidebar(){

    const navigate = useNavigate();

    const logout = () =>{
        toast.success("Logging Out");
        setTimeout(() => {
            localStorage.clear();
            navigate('/');
        }, 2000);

    }

    return(
        <div className='sidebar'>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className='side-logo'>
                <img src={logo} alt="" />
            </div>
            <div className='center-navigation'>
                <NavLink exact to="/home">
                    <FontAwesomeIcon icon={faHome} className='side-icon'/>
                </NavLink> 
                <NavLink to="/scheduling">
                    <FontAwesomeIcon icon={faCalendar} className='side-icon'/>
                </NavLink>
                <NavLink to="/history">
                    <FontAwesomeIcon icon={faBell} className='side-icon'/>
                </NavLink>
                <NavLink to="/setting">
                    <FontAwesomeIcon icon={faGear} className='side-icon'/>
                </NavLink>
            </div>

            <div className='bottom-navigation'>
                <button className='logout'onClick={logout}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} className='side-icon'/>
                </button>
                <button className='profile'>
                    <FontAwesomeIcon icon={faArrowCircleLeft} className='side-icon'/>
                </button>
            </div>
        </div>
    )
}

export default Sidebar;