import React, { Component } from 'react';

import './style.css';

export default class MainPanel extends Component{

    static elements = {
        title: document.getElementsByClassName("main-title"),
        subtitle: document.getElementsByClassName("subtitle"),
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

    render(){
        return <div id='main-panel'>
            <div className='title'>
                <div className='before-title'>{this.props.beforeTitle}</div>
                <div className='main-title'>{this.props.title}</div>
            </div>
            <div className='subtitle'>
                {this.props.subtitle}
            </div>
            <div>
                {this.props.children}
            </div>
        </div>
    
    }
}