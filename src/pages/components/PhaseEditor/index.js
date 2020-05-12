import React, {useState} from 'react';
import {FiPlayCircle, FiEdit, FiTrash2} from 'react-icons/fi';

import Welcome from '../Welcome';

import './style.css';

import backend from '../../../services/backend';

export default function PhaseEditor(props){
    return(
        <div className="phase-editor">
            <div className="menu-action">
                <div className="action"><span>Execute</span><FiPlayCircle size="20" /></div>
            </div>
            <div className="phases-canvas">
                {props.phases.map(phase => (
                <div className="phase" key={phase._id}>
                    <div className="upper-menu">
                        <div className="btn"><FiEdit size="16"/></div>
                        <div className="btn"><FiTrash2 size="16"/></div>
                    </div>
                    <span className="title">{phase.name} <span style={{"fontSize":"12px","color":"#c1c1c1"}}>({phase.type<=2?"JOB":"Command"})</span></span>
                    <span className="description">{phase.description} ...</span>
                    <textarea className="object" value={phase.object} disabled> </textarea>
                    <span className="modified">modified: {phase.modified.replace('T', ' ').substring(0, 16)}</span>
                </div>))}
                
            </div>
        </div>
    );
};