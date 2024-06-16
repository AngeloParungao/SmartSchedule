import React from 'react';
import Sidebar from '../assets/components/sidebar';
import '../css/scheduling.css'
import Navbar from '../assets/components/scheduling-navbar';

function Scheduling(){

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timesOfDay = ['7:00 AM','8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

    return(
        <div>
            <Sidebar/>
            <Navbar/>
            <div className='scheduling-container'>
                <div className="timetable">
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        {daysOfWeek.map(day => (
                        <th key={day}>{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {timesOfDay.map(time => (
                        <tr key={time}>
                        <td>{time}</td>
                        {daysOfWeek.map(day => (
                            <td key={`${day}-${time}`}>
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
           
    )
}

export default Scheduling;
