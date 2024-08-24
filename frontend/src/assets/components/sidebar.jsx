import React , { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import '../../css/sidebar.css';
import logo from '../images/logo_white_no_bg 2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faHome , faNoteSticky, faCalendar , faBell, faGear, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

function Sidebar(){
    const url = "https://smartschedule-backend.onrender.com/";

    const [user, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('userId'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}api/auth/fetch`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch users:', err);
                toast.error("Failed to fetch users");
            });
        });

    const showSidebar = () =>{
        document.querySelector('.sidebar-action').style.marginLeft = '0';
        document.querySelector('.sidebar-action').style.backgroundColor = '#343B46';
        document.querySelector('.sidebar-action').style.borderTopRightRadius = '1rem';
        document.querySelector('.sidebar-action').style.borderBottomRightRadius = '1rem';
        document.getElementById('bars').style.display = 'none';
        document.getElementById('x-mark').style.display = 'block';
        document.querySelector('.sidebar').style.marginLeft = '0';
    }

    const closeSidebar = () =>{
        document.querySelector('.sidebar-action').style.marginLeft = '0';
        document.querySelector('.sidebar-action').style.backgroundColor = 'transparent';
        document.querySelector('.sidebar-action').style.borderRadius = '0';
        document.getElementById('bars').style.display = 'block';
        document.getElementById('x-mark').style.display = 'none';
        document.querySelector('.sidebar').style.marginLeft = '-6rem';
    }

    const logout = () =>{
        toast.success("Logging Out");
        setTimeout(() => {
            localStorage.removeItem('userId');
            navigate('/');
        }, 2000);
    }

    return(
        <div className='sidebar'>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className='sidebar-action'>
                <FontAwesomeIcon icon={faBars} className='side-icon' id='bars' onClick={showSidebar}/>
                <FontAwesomeIcon icon={faXmark} className='side-icon' id='x-mark' onClick={closeSidebar}/>
            </div>
            <div className='side-logo'>
                <img src={logo} alt="" />
            </div>
            <div className='center-navigation'>
                <NavLink exact to="/home">
                    <FontAwesomeIcon icon={faHome} className='side-icon'/>
                </NavLink> 
                <NavLink exact to="/draft">
                    <FontAwesomeIcon icon={faNoteSticky} className='side-icon'/>
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
                    <FontAwesomeIcon icon={faRightFromBracket} className='side-icon'/>
                </button>
                <div className='profile'>
                    <div>
                        {
                            user.map(user =>{
                                if(user.user_id === currentUser){
                                    return(
                                        <span className='initial'>
                                            {user.username.charAt(0)}
                                        </span>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
