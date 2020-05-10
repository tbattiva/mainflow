import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiUser, FiLock} from 'react-icons/fi'

import backend from '../../services/backend';

import './style.css';
import logo from '../../assets/logo.svg';

export default function Logon(props){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory();

    async function handleLogin(e){
        e.preventDefault()

        const data = {
            email,
            password
        }

        try {
            const resp = await backend.post('sessions', data);
            localStorage.setItem("user-id", resp.data._id);
            localStorage.setItem("user-name", resp.data.name);

            history.push('/panel')
        } catch (error) {
            alert("Couldn't connect");
        }

    }

    return (
        <div id="login">
            <div className="login-left">
                <div className='logo'>
                    <img src={logo} alt='Mainflow'/>
                </div>
                <div className="title">
                    MAINFLOW
                </div>
                <div className="subtitle">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </div>
            </div>
            <div className="login-right">
                <div className="title">
                    welcome
                </div>
                <form onSubmit={handleLogin}>
                    <div className="input-box">
                        <div className="icon">
                            <FiUser />
                        </div>
                        <input 
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="e-mail"
                        />
                    </div>
                    <div className="input-box">
                        <FiLock className="icon" />
                        <input 
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="password"
                        />
                    </div>
                    
                    <button>Log-In</button>
                    <span className="forgot"><span>Forgot password?</span></span>
                    <span className="register"><Link to="/register">Register!</Link></span>
                </form>

            </div>
        </div>
    );
}