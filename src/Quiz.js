"use strict"

import React, { Component } from 'react'
import renderHTML from 'react-render-html'; 

import Player from './player'
import { _ } from './util'

export default class Quiz extends Component {
  constructor(props) {
    super (props);

    this.userAnswer = {};

  }

  render() {
    if (this.props.data) {
      // bind event to user answer object such as checkbox, radio or text box
      const quiz = this.bindEvent(this.props.data)
      return (
        <div>
          {quiz}
        </div>
      )
    } else {
      return (
        <div>
          Quiz 1.0
        </div>
      )
    }
    
  }

  onRadioChange(id, evt) {
    const correctAnswer = this.props.data.answer;
    for (let qid in correctAnswer) {
      if (qid === id) {
        this.userAnswer[qid] = evt.target.checked;
      } else {
        this.userAnswer[qid] = false;
      }
    }
    console.log(this.userAnswer)
  }

  finish(id, evt) {
    this.props.finish(id);
  }

  bindEvent(quiz) {

    const answer = quiz.answer;
    
    const deepClone = (el) => {
      let children = [];
      if (!_.isObject(el)) {
        return el;
      }
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => deepClone(child))
      }
      /* bind events to elmenent */
      let event = '';
      let fn = '';

      if (el.props.id && el.props.id in answer) {
        if (el.type && el.type === 'input') {
          event = 'onChange';
          const type = el.props.type || '';
          switch (type) {
            case 'radio':
              fn = 'onRadioChange';
              break
            case 'checkbox':
              fn = 'onCheckboxChange';
              break
            case 'text':
              fn = 'onTextChange';
              break
            default:
              throw new Error('Only support radio, checkbox and text in answer input')
              break
          }
        } else {
          throw new Error('The answer must be an input type')
        }          
      }

      if (el.props.id && el.props.id === 'btn-continue') {
        event = 'onClick';
        fn = 'finish';
      }

      if (fn.length > 0) {
        const prop = {};
        prop[event] = (evt) => this[fn](el.props.id, evt);
        return React.cloneElement(el, prop)  
      } else {
        if (children.length > 0) {
          return React.cloneElement(el, {}, children)
        } else {
          return el;
        }
      }
    }

    const el = renderHTML(quiz.question);
    return deepClone(el);

  }

}