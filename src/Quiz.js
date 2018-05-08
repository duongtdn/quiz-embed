"use strict"

import React, { Component } from 'react'
import renderHTML from 'react-render-html'; 

import Player from './player'
import { _ } from './util'

export default class Quiz extends Component {
  constructor(props) {
    super (props);

    this.state = {
      index: 0
    }

    this.userAnswer = {};

    ['next', 'previous'].forEach( method => this[method] = this[method].bind(this))

  }

  render() {
    if (this.props.data) {
      // bind event to user answer object such as checkbox, radio or text box
      const quiz = this.bindEvent(this.props.data[this.state.index])
      return (
        <div className = 'quiz' >
          {this._renderHeader()}
          <div className='w3-container'>
            {quiz}
          </div>
          {this._renderFooter()}
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

  _renderHeader() {
    const data = this.props.data;
    const quiz = data[this.state.index]
    return (
      <div className='w3-container' style={{padding:'8px 16px'}} >
        <div className='w3-cell-middle w3-large' style={{display:'inline-block'}} > {quiz.title} </div>
        <div className='w3-right' style={{display:'inline-block'}} >
          <button className='w3-button' onClick={this.previous} > <i className='fa fa-arrow-left' /> </button>
          {
            data.map( (quiz,index) => {
              let _class = 'w3-cell-middle circle circle-border circle-queue ';
              if (index === this.state.index) {
                _class += 'circle-current '
              }
              return (
                <div key={index} className={_class} />
              )
            })
          }
          <button className='w3-button' onClick={this.next}> <i className='fa fa-arrow-right' /> </button>
        </div>
      </div>
    )
  }

  _renderFooter() {
    return (
      <div className='w3-container w3-padding w3-border-top w3-bottom'>
        <button id="btn-submit" className='w3-button w3-blue'> Submit </button>
        <button id="btn-hint" className='w3-button w3-right w3-text-blue'> Hint </button>
        {/* <button id="btn-continue">Submit</button> */}
      </div>
    )
  }

  onRadioChange(id, evt) {
    const data = this.props.data;
    const quiz = data[this.state.index]
    const correctAnswer = quiz.answer;
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

  next() {
    const index = this.state.index + 1;
    this.setState({ index })
  }

  previous() {
    const index = this.state.index - 1;
    this.setState({ index })
  }

}