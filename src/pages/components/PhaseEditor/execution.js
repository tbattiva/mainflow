import backend from '../../../services/backend';
import MainPanel from '../MainPanel';

function setRunningIpLabel(ip){
    document.querySelector("#flow-title .running-status .host").innerText = ip;
}

function setPhaseAsEnded(phaseIx){
    if(MainPanel.runningMode()){
        document
            .querySelector(".phases-canvas")
                .getElementsByClassName("phase")[phaseIx-1]
                    .classList.add("done");     
    }
}

function resetPhasesStatus(){
    const phases = document.querySelector(".phases-canvas").getElementsByClassName("phase");
    for (let index = 0; index < phases.length; index++) {
        phases[index].classList.remove("done");
    } 
}

function switchCredentialsForm(toOpen=true){
    const disp = toOpen? "block" : "none";
    document.getElementsByClassName("credentials")[0]
        .style
            .display = disp;
}

async function runFlow(e, flowId, hostObj, user, pass, author){
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
    } catch (error) {
        console.log(error);
        alert("Something went wrong while trying to run the Flow!");
    }
}

async function stopFlow(flowId, author){
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
        alert("Command sent")
    } catch (error) {
        console.log(error);
        alert("Something went wrong while trying to stop the Flow!");
    }
}

export {
    setRunningIpLabel, 
    setPhaseAsEnded,
    resetPhasesStatus, 
    switchCredentialsForm,
    runFlow,
    stopFlow
}