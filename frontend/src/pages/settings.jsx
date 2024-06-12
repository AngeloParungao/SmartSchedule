import React from 'react';
import Sidebar from '../assets/components/sidebar';
import '../css/settings.css'

function Settings(){
    return(
        <div>
            <Sidebar/>
            <div className='settings-container'>
                SETTINGS
            </div>
        </div>
    )
}

export default Settings