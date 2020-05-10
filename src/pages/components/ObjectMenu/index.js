import React, {useEffect, useState} from 'react';
import {FiPower, FiSearch, FiTrash2} from 'react-icons/fi';

import backend from '../../../services/backend';


import './style.css';

export default function RightMenu(props){

    const [list, setList] = useState([]);
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
    }, []);

    async function handleFlowDeletion(flowId){

        const delOp = await backend.delete(`/flows/${flowId}`);

        if (delOp.data.ret == 1){
            alert("Flow deleted!!");
            document.getElementById(flowId).remove();
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


    return (
        <div>
            <div className='rm-upper-menu'>
                <button className='square-btn'>
                    <FiPower size="20"/>
                </button>
            </div>
            <div className='rm-list-menu'>
                <div className='upper-menu'>
                    <div className='select'>
                        <select>
                            <option>Flows</option>
                            <option>Hosts</option>
                        </select>
                    </div>
                    <div className='search'>
                        <input type='text'></input>
                        <FiSearch size="20" />
                    </div>
                </div>
                <ul className='list'>
                    {list.map(item => (
                        <li className='flow-item ' id={item._id} key={item._id}>
                            <div className="data">
                                <span className='title'>{item.name}</span> 
                                <span className='description'>{item.description}...</span> 
                            </div>
                            <div className='play-btn'>
                                <FiTrash2 onClick={(e) => {handleFlowDeletion(item._id)}}/>
                            </div> 
                            
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
}