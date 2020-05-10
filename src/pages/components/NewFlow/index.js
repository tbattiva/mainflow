import React, {useState} from 'react';
import {FiLayers} from 'react-icons/fi';

import Welcome from '../Welcome';

import './style.css';

import backend from '../../../services/backend';

export default function NewFlow(props){

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function handleNewFlow(e){
        e.preventDefault();
        
        const data = {
            name,
            description
        }

        try {
            
            const resp = await backend.post("/flows", data);
            if(resp.status == 200) {
                alert("New Flow added!")
                props.setContent((<Welcome setContent={props.setContent}/>))
                props.resetList();
            }
            else {
                alert("Error: The server couldn't add the new Flow.");
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
                <FiLayers size="25"/>
                <form onSubmit={handleNewFlow}>
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
                    <div className="menu-btns">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="confirm">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}