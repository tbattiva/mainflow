import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './style.css';

export default class MainPanel extends Component{

    static elements = {
        title: document.getElementsByClassName("main-title"),
        subtitle: document.getElementsByClassName("subtitle"),
    }

    static setRunningModeOn = () =>{
        document.getElementById("main-panel").classList.add("running");
        return;
    }

    static setRunningModeOff = () =>{
        document.getElementById("main-panel").classList.remove("running");
        return;
    }

    static runningMode = () =>{
        const classList = document.getElementById("main-panel").classList;
        for (let index = 0; index < classList.length; index++) {
            if (classList[index] === "running") return true;    
        }
        return false;
    }

    static setUpdateModeOn = () =>{
        document.getElementById("main-panel").classList.add("alt");
        return;
    }
    static setUpdateModeOff = () =>{
        document.getElementById("main-panel").classList.remove("alt");
        return;
    }
    static getTitle = () =>{
        return this.elements.title[0].innerText;
    } 
    static getSubtitle = () =>{
        return this.elements.subtitle[0].innerText;
    }

    static setTitle = (str) =>{
        ReactDOM.render(str, document.querySelector("#main-panel .main-title"));
    }

    static setSubtitle = (str) =>{
        ReactDOM.render(str, document.querySelector("#main-panel .subtitle"));
    }

    static setMainContent = (content) =>{
        ReactDOM.render(content, document.querySelector("#main-panel .main-content"));
    }

    

    render(){
        

        return <div id='main-panel'>
            <div className='title'>
                <div className='before-title'>{this.props.beforeTitle}</div>
                <div className='main-title'>{this.props.title}</div>
            </div>
            <div className='subtitle'>
                {this.props.subtitle}
            </div>
            <div className="main-content">
                {this.props.children}
            </div>
        </div>
    
    }
}