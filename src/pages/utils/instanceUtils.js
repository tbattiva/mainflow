import React from 'react';
import strings from './strings';
import { setContent } from '../Mainflow/content';

import PhaseEditor from '../components/PhaseEditor';
import FlowTitle from '../components/FlowTitle';

import backend from '../../services/backend';

async function handleInstanceOpening(instanceId){
    try {
        const openedInstance = await backend.get(`/execs/get/${instanceId}`);
        const instanceData = openedInstance.data;
        const flow = instanceData.flowId;
        setContent(
            (<PhaseEditor 
                phases={flow.phases} 
                flowId={flow._id}
                phaseOutput={instanceData.phaseOutput} 
                phaseSysout={instanceData.phaseSysout} />),
            (<FlowTitle title={flow.name}></FlowTitle>),
            flow.description
        );
    } catch (error) {
        console.log(error)
        alert(strings.messages.FAILED_TO_OPEN_INSTANCE);
    }
}

function handleInstanceDeletion(){

}

export {
    handleInstanceOpening,
    handleInstanceDeletion
}