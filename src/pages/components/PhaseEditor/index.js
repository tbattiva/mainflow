import React, {useState} from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import {FiPlayCircle, FiEdit, FiTrash2, FiXCircle, FiSave} from 'react-icons/fi';

import './style.css';
import './tag.css';

import backend from '../../../services/backend';

export default function PhaseEditor(props){

    const author = localStorage.getItem("user-id");

    // START: TAGS

    const KeyCodes = {
        comma: 188,
        enter: 13,
    };
       
    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    const [tagsCollection, setTagsCollection] = useState({
        tags: [
            { id: "CC 0000", text: "CC 0000" },
        ],
        suggestions: [
            { id: 'CC 0004', text: 'CC 0004' },
        ]
    });

    const { tags, suggestions } = tagsCollection;

    function handleDelete(i) {
        const { tags } = tagsCollection;
        setTagsCollection({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    function handleAddition(tag) {
        setTagsCollection(tagsCollection => ({ tags: [...tagsCollection.tags, tag] }));
    }

    // END: TAGS

    const [phases, setPhases] = useState(props.phases) ;
    let phasesClone = [...phases];

    const [newPhaseType, setNewPhaseType] = useState(0);
    const [newPhaseName, setNewPhaseName] = useState("");
    const [newPhaseDescription, setNewPhasesDescription] = useState("");
    const [newPhaseObject, setNewPhasesObject] = useState("");

    function handleNewPhaseType(vle){
        setNewPhaseType(vle);
        document.getElementsByClassName("new-phase-board")[0].style.display = "block";

    }

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


    async function deletePhase(obj, phaseId){
        if (window.confirm("Are You sure?\n You won`t be able to undo this operation!")){
            try {
                await backend.delete(`/flows/${props.flowId}/phases/${phaseId}`);
                obj.remove();
                alert("Phase deleted!");
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function saveNewPhase(){

        const nextPhaseCondition = tagsCollection.tags.map((value, ix) => value.text);

        const data = {
            name: newPhaseName,
            description: newPhaseDescription,
            object: newPhaseObject,
            type: newPhaseType,
            nextPhaseCondition
        }

        try {
            const phase = await backend.post(
                `/flows/${props.flowId}/phases`, 
                data,
                {
                    headers:{
                        "user-id":author,
                    }
                });

            //let phasesClone = [...phases];
            setPhases([...phases, ...[phase.data]])
            alert("New phase saved!");
            resetNewPhase();
        } catch (error) {
            alert('Something went wrong!');
            console.log(error);
        }
    }

    function resetNewPhase(){
        setNewPhaseType(0);
        document.getElementById("new-phase-type").selectedIndex = 0;

        setNewPhaseName("");
        setNewPhasesDescription("");
        setNewPhasesObject("");
        document.getElementsByClassName("new-phase-board")[0].style.display = "none";
    }

    function drawPhase(phase, ix){
        return (
            <div className="phase" key={phase._id}>
                <input className="id" type="hidden" value={phase._id}></input>
                <input className="type" type="hidden" value={phase.type}></input>
                <div className="upper-menu"> 
                    <div className="btn edition"><FiXCircle size="16" onClick={e => {stopEdition(e.target.closest(".phase"))}}/></div>
                    <div className="btn edition"><FiSave size="16" onClick={e => savePhase(e.target.closest(".phase"))} /></div>
                    <div className="btn"><FiEdit size="16" onClick={e => {startEdition(e.target.closest(".phase"))}}/></div>
                    <div className="btn"><FiTrash2 size="16" onClick={e => {deletePhase(e.target.closest(".phase"), phase._id)}}/></div>
                </div>
                <div className="title" ><div  onKeyPress={e => handlePhaseTextChange(e, 30)}>{phase.name}</div> <span style={{"fontSize":"12px","color":"#c1c1c1"}}>({phase.type<=2?"JOB":"Command"})</span></div>
                <div className="description"  onKeyPress={e => handlePhaseTextChange(e, 300)}>{phase.description}</div>
                <textarea className="object" value={phase.object} onChange={e => handlePhaseObjectChange(e.target.value, ix)}> </textarea>
                <span className="modified">modified: {phase.modified.replace('T', ' ').substring(0, 16)}</span>
            </div>
        );
    }

    return(
        <div className="phase-editor">
            <div className="menu-action">
                <div className="action"><span>Execute</span><FiPlayCircle size="20" /></div>
            </div>
            <div className="phases-canvas">
                {phases.map((phase, ix) => {                    
                    return drawPhase(phase, ix);
                })}
            </div>
            <div className="new-phase">
                <div className="selector">
                    <span>Add a new </span>
                    <div className="select">
                        <select id="new-phase-type" onChange={e => handleNewPhaseType(e.target.value)}>
                            <option value="0" selected disabled>select one</option>
                            <option value="2">JOB</option>
                            <option value="3">Command</option>
                        </select>
                    </div>
                </div>
                <div className="new-phase-board"> 
                    <form className="">
                        <input 
                            type="text" 
                            placeholder="title"
                            onChange={e => setNewPhaseName(e.target.value)}
                            value={newPhaseName}
                        ></input>
                        <input 
                            type="text" 
                            placeholder="description"
                            onChange={e => setNewPhasesDescription(e.target.value)}
                            value={newPhaseDescription}
                        ></input>
                        <textarea 
                            placeholder="JCL"
                            onChange={e => setNewPhasesObject(e.target.value)}
                            value={newPhaseObject}
                        ></textarea>
                        <ReactTags 
                            placeholder="keep running conditions"
                            autofocus={false}
                            tags={tags}
                            suggestions={suggestions}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            allowDragDrop={false} 
                            delimiters={delimiters} />
                    </form>
                    <div className="menu-btns">
                        <button className="" onClick={resetNewPhase}>Cancel</button>
                        <button className="confirm" onClick={saveNewPhase}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};