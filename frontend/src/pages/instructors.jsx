import React from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import '../css/instructors.css';

function Instructors(){
    return(
        <div>
            <Sidebar/>
            <Navbar/>
            <div className='instructors-container'>
                <form action="" className='instructor-form'>
                    <h2>Add Instructor</h2>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input  type="email" placeholder="Email" required/>
                    </div>
                    <div>
                        <label htmlFor="firstname">First Name:</label>
                        <input  type="text" placeholder="First Name" required/>
                    </div>
                    <div>
                        <label htmlFor="middlename">Middle Name:</label>
                        <input  type="text" placeholder="Middle Name" required/>
                    </div>
                    <div>
                        <label htmlFor="lastname">Last Name:</label>
                        <input  type="text" placeholder="Last Name" required/>
                    </div>
                    <div>
                        <label htmlFor="type">Work Type:</label>
                        <select name="type" >
                            <option value="regular">Regular</option>
                            <option value="part-timer">Part Time</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags">Labels/Tags:</label>
                        <textarea name="" id=""></textarea>
                    </div>
                    <button id='addData'>ADD INSTRUCTOR</button>
                </form>
                <div>
                    <table>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Instructors;
