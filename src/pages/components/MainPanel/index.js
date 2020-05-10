import React from 'react';

import './style.css';

export default function MainPanel(props){
    return (
        <div id='main-panel'>
            <div className='title'>
                <div className='before-title'>{props.beforeTitle}</div>
                <div className='main-title'>{props.title}</div>
            </div>
            <div className='subtitle'>
                {props.subtitle}
            </div>
            <div>
                {props.children}
            </div>
        </div>
    );
}