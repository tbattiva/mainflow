import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {FiPower, FiSearch, FiTrash2} from 'react-icons/fi';

import backend from '../../services/backend';

import LeftMenu from '../components/LeftMenu';
import MainPanel from '../components/MainPanel';
import RightMenu from '../components/RightMenu';
import Welcome from '../components/Welcome';


import './style.css';
import './hostList.css';

export default function Mainflow(props){
    const history = useHistory();

    const [userId, setUserId] = useState(localStorage.getItem("user-id"));
    const [userName, setUserName] = useState(localStorage.getItem("user-name"));

    if (!userId) history.push("/");

    function handleLogout(){

        localStorage.removeItem('user-id');
        localStorage.removeItem('user-name');

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

    const fResetList = (value) =>{
        setListChange(value);
    }
    const fResetHostList = (value) =>{
        setHostListChange(value);
    }

    const [list, setList] = useState([]);
    const [hostList, setHostList] = useState([]);
    const [listChange, setListChange] = useState("");
    const [hostListChange, setHostListChange] = useState("");
    //const [flagChanged, setFlagChanged] = useState(false);
    
    useEffect(() => {
        backend.get('/flows')
            .then(resp => {
                setList(resp.data);
            })
            .catch(err => {
                alert("error");
                console.log(err)
            });
        
    }, [listChange]);

    useEffect(() => {
        backend.get('/hosts',{headers:{"user-id": userId}})
            .then(resp => {
                setHostList(resp.data);
            })
            .catch(err => {
                alert("error");
                console.log(err)
            });
        
    }, [hostListChange]);


    async function handleFlowDeletion(flowId, obj){

        const delOp = await backend.delete(`/flows/${flowId}`);

        if (delOp.data.ret == 1){
            alert("Flow deleted!!");
        }
        else if(delOp.data.ret == -1){
            alert("Flow couldn't be deleted!");
            
        }
        else if(delOp.data.ret == -2){
            alert("Phases couldn't be deleted!");
        }
        else{
            alert("Something got wrong!")
        }
        console.log(delOp.data);
    }

    async function handleHostDeletion(hostId, obj){
        try {
            const delOp = await backend.delete(`/hosts/${hostId}`);
            alert("Host Deleted");
            obj.parentElement.closest(".host-item").remove();
            return;
        } catch (error) {
            alert("Something got wrong!");
            console.log(error);
        }

    }


    //* ========================================== *//

    const fSetContent = (component) =>{
        setMainContent(component)
    }


    const [mainContent, setMainContent] = useState((
        <Welcome 
            setContent={fSetContent}
            resetList={fResetList}
            resetHostList={fResetHostList}
        />
    ));
    

    return (
        <div id='mainflow'>
            <LeftMenu 
                setContent={fSetContent}
            />
            <MainPanel 
                title='MAINFLOW'
                beforeTitle='Keep Flowing' 
                subtitle='Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
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
                        {list.map(item => (
                            <li className='flow-item ' id={item._id} key={item._id}>
                                <div className="data">
                                    <span className='title'>{item.name}</span> 
                                    <span className='description'>{item.description}...</span> 
                                </div>
                                <div className='play-btn'>
                                    <FiTrash2 
                                        onClick={
                                            (e) => {
                                                handleFlowDeletion(item._id)
                                            }
                                        }
                                    />
                                </div> 
                                
                            </li>
                        ))}
                    </ul>
                    <ul className='host-list'>
                        {hostList.map(item => (
                            <li className='host-item ' id={item._id} key={item._id}>
                                <div className="data">
                                    <span className='title'>{item.name}</span> 
                                    <span className='description'>{item.ip}:{item.port}</span> 
                                </div>
                                <div className='play-btn'>
                                    <FiTrash2 
                                        onClick={
                                            (e) => {
                                                handleHostDeletion(item._id, e.target)
                                            }
                                        }
                                    />
                                </div> 
                                
                            </li>
                        ))}
                    </ul>
                </div>
            </RightMenu>
        </div>
    );
}; 