import React from 'react';
import backend from '../../services/backend';

import MainPanel from '../components/MainPanel';
import PhaseEditor from '../components/PhaseEditor';
import FlowTitle from '../components/FlowTitle';

import { FiEdit3, FiSave} from 'react-icons/fi';

import { setContent } from '../Mainflow/content';

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

async function handleFlowOpening(flowId){
    try {
        const openedFlow = await backend.get(`/flows/${flowId}`);

        setContent(
            (<PhaseEditor 
                phases={openedFlow.data.phases} 
                flowId={flowId} />),
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
        console.log(error)
        alert("Something went wrong when trying to open Flow!")
    }
}

async function handleFlowDeletion(flowId, obj){

    try {
        const delOp = await backend.delete(`/flows/${flowId}`);

        if (delOp.data.ret === 1){
            obj.parentElement.closest(".flow-item").remove();
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
        
    } catch (error) {
        alert("Something went wrong while deleting FLow!")
        console.log(error);
    }
    
}

export {
    startFlowUpdate,
    stopFlowUpdate,
    handleFlowUpdate,
    handleFlowOpening,
    handleFlowDeletion
}