import React from 'react';
import ReactDOM from 'react-dom';

import {handleHostDeletion} from './hostUtils';
import {handleFlowDeletion, handleFlowOpening} from './flowUtils';
import backend from '../../services/backend';

import { FiTrash2 } from 'react-icons/fi';

async function getHostList(){
    const userId = localStorage.getItem("user-id");

    try {
        const hostList = await backend.get('/hosts',{headers:{"user-id": userId}});
        
        return hostList.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getFlowList(){
    try {
        const flowList = await backend.get('/flows');     
        return flowList.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function refreshFlowList () {
    const flowList = await getFlowList();
    let flDOM = (<div>
        {flowList.map(item => (
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
    </div>);

    ReactDOM.render(flDOM, document.querySelector(".rm-list-menu .flow-list"));
}

async function refreshHostList () {
    const hostList = await getHostList();
    let hlDOM = (<div>
        {hostList.map(item =>  (<li className='host-item ' id={item._id} key={item._id}>
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
        </li>)
        )}
    </div>);
    
    ReactDOM.render(hlDOM, document.querySelector(".rm-list-menu .host-list"));
}

export {
    refreshFlowList,
    refreshHostList
}