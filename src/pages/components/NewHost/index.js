import React, {useState} from 'react';
import {FiHexagon} from 'react-icons/fi';

import Welcome from '../Welcome';

import './style.css';

import backend from '../../../services/backend';

export default function NewHost(props){

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hostname, setHostname] = useState("");
    const [port, setPort] = useState("");

    const userId = localStorage.getItem("user-id");

    async function handleNewHost(e){
        e.preventDefault();
        
        const data = {
            name,
            description,
            ip:hostname,
            port
        }

        try {
            
            const resp = await backend.post(
                "/hosts", 
                data, 
                {
                    headers:{
                        "user-id": userId
                    }
                });
            if(resp.status == 200) {
                alert("New Host added!")
                props.setContent((<Welcome 
                    setContent={props.setContent}
                    resetList={props.resetList}
                    resetHostList={props.resetHostList}
                />))
                props.resetHostList(resp.data._id);
            }
            else {
                alert("Error: The server couldn't add the new Host.");
            }
        } catch (error) {
            alert("erro")
            console.log(error)
        }

        
    }

    function handleCancel(e){
        e.preventDefault();
        props.setContent((<Welcome setContent={props.setContent}/>));
    }

    return (
        <div className='new-flow'> 
            <div className="add-new-box">
                <FiHexagon size="25"/>
                <form onSubmit={handleNewHost}>
                    <label>name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    ></input>
                    <label>description</label>
                    <input 
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        ></input>
                    <label>hostname</label>
                    <input 
                        type="text"
                        value={hostname}
                        onChange={e => setHostname(e.target.value)}
                        ></input>
                    <label>port</label>
                    <input 
                        type="text"
                        value={port}
                        onChange={e => setPort(e.target.value)}
                    ></input>
                    <div className="menu-btns">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="confirm">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}