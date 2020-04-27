import React from 'react';

import LeftMenu from '../components/LeftMenu';
import MainPanel from '../components/MainPanel';
import RightMenu from '../components/RightMenu';

export default function Logon(props){
    return (
        <div id='mainflow'>
            <LeftMenu />
            <MainPanel 
                title='MAINFLOW'
                beforeTitle='Keep Flowing' 
                subtitle='Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            />
            <RightMenu />
        </div>
    );
}; 