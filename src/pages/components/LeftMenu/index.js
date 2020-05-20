import React, { Component } from 'react';
import { FiHome, FiList, FiBarChart2, FiTriangle } from 'react-icons/fi';

import Welcome from '../Welcome';

import { setContent } from '../../Mainflow/content';

import './style.css';
import logo from '../../../assets/logo.svg';


export default class LeftMenu extends Component{

    static turnNotificationOn = () => {
        document
            .getElementsByClassName("notification-icon")[0]
                .style.display = "flex";
    }


    render(){
    return(
        <div id='left-menu'>
            <div className='logo'>
                <img src={logo} alt='Mainflow'/>
            </div>
            <div className='menu-grp'>

                <div className='menu-item' onClick={e => setContent((<Welcome />))}>
                    <FiHome size="22"/>
                    <div className="notification-icon">
                        <FiTriangle />
                    </div>
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
}