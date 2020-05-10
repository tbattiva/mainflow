import React from 'react';
import {Link} from 'react-router-dom';
import {FiUser, FiLock, FiAtSign, FiBriefcase, FiLogIn, FiGithub } from 'react-icons/fi';

import backend from '../../services/backend';


import './style.css';
import logo from '../../assets/logo.svg';
import { useState } from 'react';

export default function Register(props){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [password, setPassword] = useState("");
    const [passConfirmation, setPassConfirmation] = useState("");
    const [github, setGithub] = useState("");

    async function handleRegister(e){
        e.preventDefault();
        if (name.trim() === ""){
            alert("Name is required!");
            return;
        }
        else if (email.trim() === ""){
            alert("E-mail is required!");
            return;
        }
        else if (password !== passConfirmation || password.trim() === "") {
            alert("Password confirmation error!\nBoth password fields must have the same value!");
            return;
        }

        const data = {
            name,
            email,
            company,
            github,
            password
        }
        try {
            const reg =await backend.post('/users', data);
            if (reg.status === 200){
                alert("Awesome! Now you can log-in");
            }
            else{
                alert("Something got wrong!");
                console.log(reg);
            }
        } catch (error) {
            alert("Something got wrong!");
            console.log(error)
        }
    }

    return (
        <div id="register">
            <div className="register-left">
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
            <div className="register-right">
                <div className="title">
                    About you
                </div>
                <form onSubmit={handleRegister}>
                    <div className="input-box">
                        <div className="icon">
                            <FiUser />
                        </div>
                        <input 
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="name"
                        />
                    </div>
                    <div className="input-box">
                        <div className="icon">
                            <FiAtSign />
                        </div>
                        <input 
                            type="text"
                            value={email}
                            placeholder="e-mail"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <div className="icon">
                            <FiGithub />
                        </div>
                        <input 
                            type="text"
                            value={github}
                            placeholder="github"
                            onChange={e => setGithub(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <div className="icon">
                            <FiBriefcase />
                        </div>
                        <input 
                            type="text"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            placeholder="company"
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
                    <div className="input-box">
                        <FiLock className="icon" />
                        <input 
                            type="password"
                            value={passConfirmation}
                            onChange={e => setPassConfirmation(e.target.value)}
                            placeholder="confirm password"
                        />
                    </div>
                    
                    <button>register</button>
                    <span className="login-link">
                        <Link to="/">Get In</Link>
                        <FiLogIn />
                    </span>
                </form>

            </div>
        </div>
    );
}