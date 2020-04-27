import React from 'react';

import './style.css';
import logo from '../../../assets/logo.svg';

export default function LeftMenu(){
    return(
        <div id='left-menu'>
            <div className='logo'>
                <img src={logo} alt='Mainflow'/>
            </div>
            <div className='menu-grp'>
                <div className='menu-item'></div>
                <div className='menu-item'></div>
            </div>
        </div>
    );
}