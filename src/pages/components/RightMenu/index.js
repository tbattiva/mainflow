import React from 'react';

import './style.css';

export default function RightMenu(props){
    return (
        <div id='right-menu'>
            {props.children}
        </div>
    );
}