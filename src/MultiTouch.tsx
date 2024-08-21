import React, { Component } from 'react';
import {
    View,
    PanResponder,
} from 'react-native';
import ReactNativeComponentTree from'react-native/Libraries/Renderer/shims/ReactNativeComponentTree';

export default class MultiTouch extends Component{
    constructor(props) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);

        this.triggerEvent = this.triggerEvent.bind(this);
    }
    onTouchStart(event){
        const element = ReactNativeComponentTree.getInstanceFromNode(event.target)._currentElement;
        this.triggerEvent(element._owner, 'onPressIn');
    }
    onTouchEnd(event){
        const element = ReactNativeComponentTree.getInstanceFromNode(event.target)._currentElement;
        this.triggerEvent(element._owner, 'onPressOut');
    }
    onTouchCancel(event){
        const element = ReactNativeComponentTree.getInstanceFromNode(event.target)._currentElement;
        this.triggerEvent(element._owner, 'onPressOut');
    }
    onTouchMove(event){
       // console.log(event);
    }
    triggerEvent(owner, event){ // Searching down the 
        if(!owner || !owner.hasOwnProperty('_instance')){
            return;
        }
        if(owner._instance.hasOwnProperty(event)){
            owner._instance[event]();
        }else{
            this.triggerEvent(owner._currentElement._owner, event);
        }
    }
    render(){
        return (
            <View
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
                onTouchCancel={this.onTouchCancel}
                onTouchMove={this.onTouchMove}>
                {this.props.children}
            </View>
        );
    }
}