import React, {useEffect, useState, Component} from 'react';
import {FiLayers, FiHexagon} from 'react-icons/fi';

import backend from '../../../services/backend';

import NewFlow from '../NewFlow';
import NewHost from '../NewHost';

import './style.css';
import LeftMenu from '../LeftMenu';

export default function Welcome(props) {
    
    const [instances, setInstances] = useState([]);

    useEffect(() => {
        backend.get('/execs/summary/desc')
            .then(resp => {
                console.log(resp);
                setInstances(resp.data);
            });
    }, [])

    return (<div className="welcome">
            <div className="add-new-menu">
                <div className="add-new-item" 
                    onClick={e => 
                        {
                            props.setContent(
                                (<NewFlow 
                                    setContent={props.setContent} 
                                    resetList={props.resetList}
                                    resetHostList={props.resetHostList}
                                />),
                                "NEW FLOW",
                                ""
                            )
                        }}>
                    <FiLayers size="38" />
                    <div className="label">
                        <div className="title">new FLOW</div>
                        <div className="subtitle">Add a new flow to your collection</div>
                    </div>
                </div>
                <div className="add-new-item" onClick={e => {props.setContent(
                        (<NewHost 
                            setContent={props.setContent}
                            resetList={props.resetList}
                            resetHostList={props.resetHostList}
                        />),
                        "NEW HOST",
                        ""
                        )}}>
                    <FiHexagon size="38" />
                    <div className="label">
                        <div className="title">new HOST</div>
                        <div className="subtitle">Add a new host on your list</div>
                    </div>
                    
                </div>
            </div>
            <div className="running-flows-list">
                <div className="title">Running Flows</div>
                {instances.filter(instance => {if(instance.status === "running") return instance})
                    .map(instance => {
                        LeftMenu.turnNotificationOn();
                        let time = instance.status === "running"? instance.starttime: instance.endtime; 
                        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:"2-digit", minute:"2-digit" };  
                        time = new Date(time).toLocaleDateString('en-US', options);

                        return (
                            <div className="flow-instance" key={instance._id}>
                                <div className="title">{instance.flowId.name} (Phase {instance.phase-1}/{instance.size})</div>
                                <div className={`status ${instance.status}`}>{time} - {instance.status}</div>
                            </div>
                        );
                    })

                }
            </div>
            <div className="previous-flows-list">
                <div className="title">Previous</div>
                {instances.filter(instance => {if(instance.status !== "running") return instance})
                    .map(instance => {
                        let time = instance.status === "running"? instance.starttime: instance.endtime; 
                        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:"2-digit", minute:"2-digit" };  
                        time = new Date(time).toLocaleDateString('en-US', options);

                        return (
                            <div className="flow-instance" key={instance._id}>
                                <div className="title">{instance.flowId.name} (Phase {instance.phase-1}/{instance.size})</div>
                                <div className={`status ${instance.status}`}>{time} - {instance.status}</div>
                            </div>
                        );
                    })
                }
            </div> 
        </div>
    );
    
}