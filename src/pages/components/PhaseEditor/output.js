function switchSysoutList(event, toOpen=true){

    if (toOpen) event.currentTarget.classList.add("opened");
    else event.currentTarget.closest(".open-sysout-btn").classList.remove("opened");
    event.stopPropagation();
}

function openSysout(ddName, ddData, event){
    event.stopPropagation();
    const jobOutputObj = event.target.closest(".job-output");
    const sysoutMemberObj = jobOutputObj.getElementsByClassName("sysout-member")[0];
    const ddNameObj = jobOutputObj.getElementsByClassName("ddname")[0];
    const ddDataObj = jobOutputObj.getElementsByClassName("dddata")[0];
    
    ddNameObj.innerText = ddName;
    ddDataObj.innerText = ddData;
    
    sysoutMemberObj.style.display = "flex";
}

export {
    switchSysoutList, 
    openSysout,
}