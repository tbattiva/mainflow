import React, { Component } from 'react';

import './style.css';

export default class FlowTitle extends Component{

    render(){
        return (
        <div id="flow-title">
            <div className="txt">{this.props.title}</div>
            <div className="menu-edit" >
                {this.props.children}
            </div>
        </div>
        );
    
    }
}