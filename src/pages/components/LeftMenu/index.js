import React from 'react';
import { FiHome, FiList, FiBarChart2 } from 'react-icons/fi';

import Welcome from '../Welcome';

import './style.css';
import logo from '../../../assets/logo.svg';

export default function LeftMenu(props){
    return(
        <div id='left-menu'>
            <div className='logo'>
                <img src={logo} alt='Mainflow'/>
            </div>
            <div className='menu-grp'>

                <div className='menu-item' onClick={e => props.setContent((<Welcome setContent={props.setContent}/>))}>
                    <FiHome size="22"/>
                </div>
                <div className='menu-item'>
                    <FiList size="22"/>
                </div>
                <div className='menu-item'>
                    <FiBarChart2 size="22"/>
                </div>
            </div>
        </div>
    );
}