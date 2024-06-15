import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';

function Sections(){

    return(
        <div>
            <Sidebar/>
            <Navbar/>
            <div className='sections-container'>
            
            </div>
        </div>
    )
}

export default Sections;
