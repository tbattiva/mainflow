import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {FiPower, FiSearch, FiTrash2, FiEdit3, FiSave} from 'react-icons/fi';

import backend from '../../services/backend';

import PhaseEditor from '../components/PhaseEditor';
import LeftMenu from '../components/LeftMenu';
import MainPanel from '../components/MainPanel';
import RightMenu from '../components/RightMenu';
import Welcome from '../components/Welcome';
import FlowTitle from '../components/FlowTitle';


import './style.css';
import './hostList.css';

export default function Mainflow(props){
    const history = useHistory();

    const userId = localStorage.getItem("user-id");
    //const [userName, setUserName] = useState(localStorage.getItem("user-name"));

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

        if (delOp.data.ret === 1){
            alert("Flow deleted!!");
        }
        else if(delOp.data.ret === -1){
            alert("Flow couldn't be deleted!");
            
        }
        else if(delOp.data.ret === -2){
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
            alert("Something went wrong!");
            console.log(error);
        }

    }

    async function handleFlowOpening(flowId){
        try {
            const openedFlow = await backend.get(`/flows/${flowId}`);
            fSetContent(
                (<PhaseEditor phases={openedFlow.data.phases} flowId={flowId} />),
                (<FlowTitle title={openedFlow.data.name}>
                    <FiEdit3 
                        className="edit icon-btn"
                        onClick={startFlowUpdate}
                    />
                    <FiSave 
                        style={{display:"none"}}
                        className="save icon-btn"
                        onClick={e => {handleFlowUpdate(flowId)}}
                    />
                </FlowTitle>),
                openedFlow.data.description
            );
        } catch (error) {
            alert("Something went wrong!")
        }
    }

    async function handleFlowUpdate(flowId){
        const data = {
            name:MainPanel.getTitle(),
            description:MainPanel.getSubtitle()
        }
        try {
            await backend.put(`/flows/${flowId}`, data);
            alert("Flow Updated!");
            stopFlowUpdate();
            return;
        } catch (error) {
            alert("Something went wrong!");
            console.log(error);
        }
    }

    function startFlowUpdate(){
        const title = MainPanel.elements.title[0];
        const subtitle = MainPanel.elements.subtitle[0];

        MainPanel.setUpdateModeOn();

        title.querySelector(".txt").setAttribute("contentEditable", true);
        subtitle.setAttribute("contentEditable", true);

        title.querySelector(".edit").style.display = "none";
        title.querySelector(".save").style.display = "block";
    }
    function stopFlowUpdate(){
        const title = MainPanel.elements.title[0];
        const subtitle = MainPanel.elements.subtitle[0];

        MainPanel.setUpdateModeOff();

        title.querySelector(".txt").setAttribute("contentEditable", false);
        subtitle.setAttribute("contentEditable", false);

        title.querySelector(".edit").style.display = "block";
        title.querySelector(".save").style.display = "none";
    }

    //* ========================================== *//

    const [title, setTitle] = useState("MAINFLOW");
    const [subtitle, setSubtitle] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry. ');

    const fSetContent = (component, title = 'MAINFLOW', subtitle='Lorem Ipsum is simply dummy text of the printing and typesetting industry. ') =>{
        setMainContent(component)
        setTitle(title);   
        setSubtitle(subtitle);   
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
                        {list.map(item => (
                            <li className='flow-item ' id={item._id} key={item._id} onClick={e => handleFlowOpening(item._id)}>
                                <div className="data">
                                    <span className='title'>{item.name}</span> 
                                    <span className='description'>{`${item.description.toString().substring(0, 20)} ...`}</span> 
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