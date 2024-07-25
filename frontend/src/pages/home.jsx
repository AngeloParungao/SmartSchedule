import React from 'react';
import Sidebar from '../assets/components/sidebar';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faEye, faBell, faCog} from '@fortawesome/free-solid-svg-icons';
import '../css/home.css';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar/>
            <div className='home-container'>
                <div className='home-header'>
                    <span>Dashboard</span>
                </div>
                <div className="dashboard-buttons">
                    <div className="dashboard-button draft-schedules" onClick={() => navigate('/draft')}>
                        <FontAwesomeIcon icon={faEye} className='eye'/>
                        <span>Draft Schedules</span>
                    </div>
                    <div className="dashboard-button create-schedule" onClick={() => navigate('/scheduling')}>
                        <FontAwesomeIcon icon={faCalendarPlus} className='calendar'/>
                        <span>Create Schedule</span>
                    </div>
                    <div className="dashboard-button activity-logs" onClick={() => navigate('/history')}>
                        <FontAwesomeIcon icon={faBell} className='bell'/>
                        <span>Activity Logs</span>
                    </div>
                    <div className="dashboard-button settings">
                        <FontAwesomeIcon icon={faCog} className='setting' onClick={() => navigate('/setting')}/>
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;