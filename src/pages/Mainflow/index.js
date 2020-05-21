import React, {useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {connect, disconnect} from '../../services/websocket';

import {FiPower, FiSearch } from 'react-icons/fi';

import LeftMenu from '../components/LeftMenu';
import MainPanel from '../components/MainPanel';
import RightMenu from '../components/RightMenu';
import Welcome from '../components/Welcome';

import {refreshHostList, refreshFlowList} from '../utils/lists';

import './style.css';
import './hostList.css';

export default function Mainflow(props){
    const history = useHistory();

    const userId = localStorage.getItem("user-id");
    //const [userName, setUserName] = useState(localStorage.getItem("user-name"));

    if (!userId) history.push("/");

 
    setupWebsocket();

    function setupWebsocket(){
        disconnect();
        connect();

    }

    function handleLogout(){

        localStorage.removeItem('user-id');
        localStorage.removeItem('user-name');
        disconnect();
        history.push("/");
    }

    function handleListChange(list){
        switch (parseInt(list)) {
            case 1:
                document.getElementsByClassName("flow-list")[0].style.display = "none";
                document.getElementsByClassName("host-list")[0].style.display = "block";
                break;
        
            default:
                document.getElementsByClassName("flow-list")[0].style.display = "block";
                document.getElementsByClassName("host-list")[0].style.display = "none";
                break;
        }
    }


    //* ==================== FLOW LIST ====================== *//


    useEffect(() => {
        refreshFlowList();
    }, []);

    useEffect(() => {
        refreshHostList();
    }, []);


    //* ========================================== *//

    
    
    const title = "MAINFLOW";
    const subtitle = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ';
    const mainContent = (<Welcome />);

    return (
        <div id='mainflow'>
            <LeftMenu />
            <MainPanel 
                title={title}
                beforeTitle='Keep Flowing' 
                subtitle={subtitle}
            >
                
                {mainContent}
                
            </MainPanel>
            <RightMenu >
                <div className='rm-upper-menu'>
                    <button className='square-btn'>
                        <FiPower size="20" onClick={handleLogout}/>
                    </button>
                </div>
                <div className='rm-list-menu'>
                    <div className='upper-menu'>
                        <div className='select' onChange={e => handleListChange(e.target.value)}>
                            <select>
                                <option value="0">Flows</option>
                                <option value="1">Hosts</option>
                            </select>
                        </div>
                        <div className='search'>
                            <input type='text'></input>
                            <FiSearch size="20" />
                        </div>
                    </div>
                    <ul className='flow-list'>
              
                    </ul>
                    <ul className='host-list'>
                        
                    </ul>
                </div>
            </RightMenu>
        </div>
    );
}; 