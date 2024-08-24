import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';
import logo from '../assets/images/smartsched_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

function Login() {
    const url = "https://smartschedule.onrender.com/";
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            navigate('/home');
        }
    }, [navigate]);

    useEffect(() => {
        axios.get(`${url}api/auth/fetch`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch users:', err);
                toast.error("Failed to fetch users");
            });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        // Validate email and password against fetched user data
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem('userId', user.user_id);
            setTimeout(() => {
                setLoading(false);
                toast.success("Login Successful!");
            }, 2000);
            setTimeout(() => {
                navigate('/home');
            }, 4000);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            setTimeout(() => {
                setLoading(false);
                toast.error("Invalid email or password");
            }, 2000);
        }
    }

    return (
        <div className='wrapper'>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className='content'>
                <div className='logo'>
                    <img src={logo} alt="SmartSched Logo" />
                </div>
                <form onSubmit={handleSubmit} className='login-form'>
                    <span className='title'>BulSU SmartSchedule</span>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} className='icon' />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            aria-label="Email"
                            required
                        />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faLock} className='icon' />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            aria-label="Password"
                            required
                        />
                    </div>
                    <button type='submit' disabled={loading}>
                        {loading ? <RotatingLines height={20} width={20} color="white" strokeWidth="4" /> : 'LOGIN'}
                    </button>
                    <a href="#">Viewing schedule</a>
                </form>
            </div>
        </div>
    );
}

export default Login;
