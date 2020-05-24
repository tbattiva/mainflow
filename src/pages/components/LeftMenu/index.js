import React from 'react';
import {setBeforeRunningFlowStarted, setBeforeRunningFlowFinished} from '../../../services/websocket';
import { FiHome, FiList, FiBarChart2, FiTriangle } from 'react-icons/fi';

import Welcome from '../Welcome';

import { setContent } from '../../Mainflow/content';

import './style.css';
import logo from '../../../assets/logo.svg';

export function turnNotificationOn(){
    document
        .getElementsByClassName("notification-icon")[0]
            .style.display = "flex";
}

export function turnNotificationOff() {
    document
        .getElementsByClassName("notification-icon")[0]
            .style.display = "none";
}

export default function LeftMenu() {
    
    
    function setupWebsocket(){

        setBeforeRunningFlowStarted((flowId, flowInstances) =>{
            turnNotificationOn()
        });

        setBeforeRunningFlowFinished((flowId, flowInstances) =>{
            turnNotificationOff();
        });
    }
    
    setupWebsocket();
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