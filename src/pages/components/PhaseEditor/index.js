import React, {useState, useEffect} from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import {FiPlayCircle, FiEdit, FiTrash2, FiXCircle, FiSave, FiStopCircle} from 'react-icons/fi';

import './style.css';
import './tag.css';

import backend from '../../../services/backend';
import MainPanel from '../MainPanel';

export default function PhaseEditor(props){

    const author = localStorage.getItem("user-id");
    useEffect(() =>{
        MainPanel.setRunningModeOff();
        backend.get(`/flows/check/${props.flowId}`)
            .then(respCheck => {
                if(respCheck.data.isRunning === true) {
                    MainPanel.setRunningModeOn();
                    setRunningIpLabel(respCheck.data.instance.ip);
                } 
            })
    }, [props.flowId]);

    const [hostList, setHostList] = useState([]);

    useEffect(() => {
        backend.get('/hosts',{headers:{"user-id": author}})
            .then(resp => {
                setHostList(resp.data);
            })
            .catch(err => {
                alert("error");
                console.log(err)
            });
        
    }, [author]);


    function setRunningIpLabel(ip){
        document.querySelector("#flow-title .running-status .host").innerText = ip;
    }

    // START: TAGS

    const KeyCodes = {
        comma: 188,
        enter: 13,
    };
       
    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    const suggestions1 =  [
        { id: "CC 0000", text: "CC 0000" },
        { id: 'CC 0004', text: 'CC 0004' },
        { id: 'true', text: 'true' },
        { id: 'false', text: 'false' },
    ]

    const [tagsCollection, setTagsCollection] = useState({
        tags: [
            { id: "CC 0000", text: "CC 0000" },
        ],
        suggestions: suggestions1
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

    function handlePhaseTagDelete(i, phaseIx) {
        phasesClone[phaseIx].nextPhaseCondition = phasesClone[phaseIx].nextPhaseCondition.filter((cond, index) => index !== i);
        setPhases(phasesClone);
    }
 
    function handlePhaseTagAddition(tag, ix) {
        if (!phasesClone[ix].nextPhaseCondition) phasesClone[ix].nextPhaseCondition = []
        phasesClone[ix].nextPhaseCondition.push(tag.id);
        setPhases(phasesClone);
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
        if (vle === 3 ){
            setTagsCollection({
                tags: [
                    { id: "true", text: "true" },
                ],
                suggestions
            });
        }
        else{
            setTagsCollection({
                tags: [
                    { id: "CC 0000", text: "CC 0000" },
                ],
                suggestions
            });
        }
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
        phase.querySelector(".title>div").setAttribute("contentEditable", true);
        phase.querySelector(".description").setAttribute("contentEditable", true);
        phase.querySelector(".object").disabled = false;
    }
    function stopEdition(phase){
        phase.classList.remove("alt");
        phase.querySelector(".title>div").setAttribute("contentEditable", false);
        phase.querySelector(".description").setAttribute("contentEditable", false);
        phase.querySelector(".object").disabled = true;
    }

    function handlePhaseObjectChange(vle, ix){
        phasesClone[ix].object = vle;
        setPhases(phasesClone);
    } 

    async function savePhase(phase, ix){
        phasesClone[ix].name = phase.querySelector(".title>div").innerText;
        phasesClone[ix].description = phase.querySelector(".description").innerText;
        setPhases(phasesClone);
        try {
            await backend.put(`/flows/${props.flowId}/phases/${phase.querySelector(".id").value}`, phases[ix]);
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

        const nextPhaseCondition = tagsCollection.tags.map((value, ix) => value.id);

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
        let tags = [];
        if (phase.nextPhaseCondition) {
            tags = phase.nextPhaseCondition.map((vl) => {return {id:vl, text:vl}});
        }

        return (
            <div className="phase" key={phase._id}>
                <input className="id" type="hidden" value={phase._id}></input>
                <input className="type" type="hidden" value={phase.type}></input>
                <div className="upper-menu"> 
                    <div className="btn edition"><FiXCircle size="16" onClick={e => {stopEdition(e.target.closest(".phase"))}}/></div>
                    <div className="btn edition"><FiSave size="16" onClick={e => savePhase(e.target.closest(".phase"), ix)} /></div>
                    <div className="btn"><FiEdit size="16" onClick={e => {startEdition(e.target.closest(".phase"))}}/></div>
                    <div className="btn"><FiTrash2 size="16" onClick={e => {deletePhase(e.target.closest(".phase"), phase._id)}}/></div>
                </div>
                <div 
                    className="title" 
                    onKeyPress={e => handlePhaseTextChange(e, 30)}
                >
                    <div>{phase.name}</div>
                    <span style={{"fontSize":"12px","color":"#c1c1c1"}}>({phase.type<=2?"JOB":"Command"})</span>
                </div>
                <div  
                    className="description" 
                    onKeyPress={e => handlePhaseTextChange(e, 300)}
                >{phase.description} </div>
                <ReactTags 
                    placeholder="keep running conditions"
                    autofocus={false}
                    tags={tags}
                    suggestions={suggestions1}
                    handleDelete={(i) => {handlePhaseTagDelete(i,ix)}}
                    handleAddition={(tag) => {handlePhaseTagAddition(tag,ix)}}
                    allowDragDrop={false} 
                    delimiters={delimiters} />
                <textarea className="object" rows="3" value={phase.object} onChange={e => handlePhaseObjectChange(e.target.value, ix)}> </textarea>
                
                <span className="modified">modified: {phase.modified.replace('T', ' ').substring(0, 16)}</span>
            </div>
        );
    }

    function switchCredentialsForm(toOpen=true){
        const disp = toOpen? "block" : "none";
        document.getElementsByClassName("credentials")[0]
            .style
                .display = disp;
    }

    const [hostObj, setHostObj] = useState("");
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    async function runFlow(e, flowId){
        e.preventDefault();

        const host = hostObj.split(":");
        const credentials = {
            host: host[0],
            port: host[1],
            user,
            pass
        }
        switchCredentialsForm(false);
        try {
            const instanceData = await backend.post(
                `/flows/${flowId}/start`,
                credentials,
                {
                    headers:{
                        "user-id":author
                    }
                }
            );
            console.log(instanceData);
            MainPanel.setRunningModeOn();
        } catch (error) {
            console.log(error);
            alert("Something went wrong while trying to run the Flow!");
        }
    }

    async function stopFlow(flowId){
        try {
            const instanceData = await backend.delete(
                `/flows/${flowId}/stop`,
                null,
                {
                    headers:{
                        "user-id":author
                    }
                }
            );
            console.log(instanceData);
            MainPanel.setRunningModeOff();
        } catch (error) {
            console.log(error);
            alert("Something went wrong while trying to stop the Flow!");
        }
    }

    return(
        <div className="phase-editor">
            <div className="menu-action">
                <div className="action stop" onClick={() => {stopFlow(props.flowId)}}>
                    <span>Stop</span><FiStopCircle size="20" />
                </div>
                <div className="action start" onClick={() => switchCredentialsForm(true)}>
                    <span>Execute</span><FiPlayCircle size="20" />
                </div>
                <form 
                    className="balloon credentials" 
                    onSubmit={e => {runFlow(e, props.flowId)}}
                    onMouseLeave={() => switchCredentialsForm(false)}
                >
                    <div className="select">
                        <select onChange={(e) => setHostObj(e.target.value)}>
                            <option selected disabled>Host</option>
                            {hostList.map(host =>(
                                <option key={host._id} value={host.ip+":"+host.port}>{host.name}</option>
                            ))}
                        </select>
                    </div>
                    <input type="text" placeholder="username" onChange={(e) => setUser(e.target.value)} />
                    <input type="password" placeholder="password" onChange={(e) => setPass(e.target.value)}/>
                    <button className="confirm">Run</button>
                </form>
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