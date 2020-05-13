import React, {useState} from 'react';
import {FiPlayCircle, FiEdit, FiTrash2, FiXCircle, FiSave} from 'react-icons/fi';

import Welcome from '../Welcome';

import './style.css';

import backend from '../../../services/backend';

export default function PhaseEditor(props){

    const [phases, setPhases] = useState(props.phases) ;
    let phasesClone = [...phases];

    function handlePhaseTextChange(e, max){
        const obj = e.target;
        if(obj.innerText.length >=max) {
            e.preventDefault();
        }
    }

    function startEdition(phase){
        phase.classList.add("alt");
        phase.querySelector(".title > div").setAttribute("contentEditable", true);
        phase.querySelector(".description").setAttribute("contentEditable", true);
        phase.querySelector(".object").disabled = false;
    }
    function stopEdition(phase){
        phase.classList.remove("alt");
        phase.querySelector(".title > div").setAttribute("contentEditable", false);
        phase.querySelector(".description").setAttribute("contentEditable", false);
        phase.querySelector(".object").disabled = true;
    }

    function handlePhaseObjectChange(vle, ix){
        phasesClone[ix].object = vle;
        setPhases(phasesClone);
    } 

    async function savePhase(phase){
        // 
        const phasesList = Array.prototype.slice.call(document.getElementsByClassName("phases-canvas")[0].children);
        const data = {
            name: phase.querySelector(".title > div").innerText,
            description: phase.querySelector(".description").innerText,
            object: phase.querySelector(".object").value,
            seqNum: phasesList.indexOf(phase),
            type:phase.querySelector(".type").value
        }
        try {
            const resp = await backend.put(`/flows/${props.flowId}/phases/${phase.querySelector(".id").value}`, data);
            alert("Phase updated!");
            stopEdition(phase);
        } catch (error) {
            alert("Something went wrong!");
        }
    }

    return(
        <div className="phase-editor">
            <div className="menu-action">
                <div className="action"><span>Execute</span><FiPlayCircle size="20" /></div>
            </div>
            <div className="phases-canvas">
                {phases.map((phase, ix) => {                    
                    return (
                    <div className="phase" key={phase._id}>
                        <input className="id" type="hidden" value={phase._id}></input>
                        <input className="type" type="hidden" value={phase.type}></input>
                        <div className="upper-menu"> 
                            <div className="btn edition"><FiXCircle size="16" onClick={e => {stopEdition(e.target.closest(".phase"))}}/></div>
                            <div className="btn edition"><FiSave size="16" onClick={e => savePhase(e.target.closest(".phase"))} /></div>
                            <div className="btn"><FiEdit size="16" onClick={e => {startEdition(e.target.closest(".phase"))}}/></div>
                            <div className="btn"><FiTrash2 size="16"/></div>
                        </div>
                        <div className="title" ><div  onKeyPress={e => handlePhaseTextChange(e, 30)}>{phase.name}</div> <span style={{"fontSize":"12px","color":"#c1c1c1"}}>({phase.type<=2?"JOB":"Command"})</span></div>
                        <div className="description"  onKeyPress={e => handlePhaseTextChange(e, 300)}>{phase.description}</div>
                        <textarea className="object" value={phase.object} onChange={e => handlePhaseObjectChange(e.target.value, ix)}> </textarea>
                        <span className="modified">modified: {phase.modified.replace('T', ' ').substring(0, 16)}</span>
                    </div>
                    )
                })}
                
            </div>
        </div>
    );
};