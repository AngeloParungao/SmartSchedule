import React from 'react';
import Sidebar from '../assets/components/sidebar';
import '../css/scheduling.css'
import Navbar from '../assets/components/scheduling-navbar';

function Scheduling(){
    return(
        <div>
            <Sidebar/>
            <Navbar/>
            <div className='scheduling-container'>
            
            </div>
        </div>
    )
}

export default Scheduling;
