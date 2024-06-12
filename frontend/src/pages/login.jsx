import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';
import logo from '../assets/smartsched_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();
        axios.post("http://localhost:8082/login", {email, password})
            .then(res => {
                toast.success("Login Successful!");
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            })
            .catch(err => toast.error("Invalid Information!"));
    }

    return(
        <div className='wrapper'>
            <div><Toaster
            position="bottom-right"
            reverseOrder={false}
            /></div>
            <div className='content'>
                <div className='logo'>
                    <img src= {logo}  alt="" />
                </div>
                <form onSubmit={handleSubmit}>
                    <span className='title'>BulSU SmartSchedule</span>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} className='icon'/>
                        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faLock} className='icon'/>
                        <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    <button type='submit'>LOGIN</button>
                    <a href="">viewing schedule</a>
                </form>
            </div>
        </div>
    )
}

export default Login