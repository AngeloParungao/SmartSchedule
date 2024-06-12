import React from 'react';
import Sidebar from '../assets/components/sidebar';
import '../css/home.css';

function Home() {
   
    return (
        <div>
            <Sidebar/>
            <div className='home-container'>
                HOME
            </div>
        </div>
    )
}

export default Home;