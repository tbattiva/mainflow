import React from 'react';
import {FiLayers, FiHexagon} from 'react-icons/fi';

import NewFlow from '../NewFlow';
import NewHost from '../NewHost';

import './style.css';

export default function Welcome(props){
    return (
        <div className="welcome">
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
                <div className="flow-instance">
                    <div className="title">FLOW TEST (Phase 2)</div>
                    <div className="status running">16:37 - May 7th- Running</div>
                </div>
            </div>
            <div className="previous-flows-list">
                <div className="title">Previous</div>
                <div className="flow-instance">
                    <div className="title">FLOW TEST (Phase 2)</div>
                    <div className="status error">16:37 - May 7th- ABENDED</div>
                </div>
                <div className="flow-instance">
                    <div className="title">FLOW TEST (Phase 2)</div>
                    <div className="status ended">16:37 - May 7th- Ended</div>
                </div>
            </div>
        </div>
    );
}