"use strict"

import React, { Component } from 'react'
import renderHTML from 'react-render-html'; 

import { _ } from './util'

export default class Quiz extends Component {
  constructor(props) {
    super (props);

    this.state = {
      index: 0,
      answer: {},
      check: null
    }

    this.userAnswer = {};

    ['next', 'previous', 'submit']
    .forEach( method => this[method] = this[method].bind(this))

  }

  componentWillReceiveProps(props) {
    if (props.data && props.data.length > 0) {
      this.quizs = props.data.map(quiz => {
        quiz.renderQuestion = () => this.renderQuestion(quiz);
        return quiz;
      })
      this.setState({index: 0, answer: {}, check: null})
    }

  }

  render() {
    setTimeout(() => this.props.notifyBodyHeight(), 0)  // it's quite tricky here
    if (this.quizs) {
      // bind event to user answer object such as checkbox, radio or text box
      const quiz = this.quizs[this.state.index]
      return (
        <div className = 'quiz' >
          {this.state.modal? this._rendermodal() : ''}
          {this._renderHeader()}
          <div className='w3-container'>
            {quiz.renderQuestion()}
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
    const quiz = this.quizs[this.state.index]
    return (
      <div className='w3-container w3-green' style={{padding:'8px 16px'}} >
        <div className='w3-cell-middle w3-large' style={{display:'inline-block'}} > {quiz.title} </div>
        <div className='w3-right' style={{display:'inline-block'}} >
          <button className='w3-button no-outline' onClick={this.previous} > <i className='fa fa-arrow-left' /> </button>
          {
            this.quizs.map( (quiz,index) => {
              let _class = 'w3-cell-middle circle circle-border circle-queue ';
              if (quiz.completed) {
                _class += 'circle-done '
              }
              if (index === this.state.index) {
                _class += 'circle-current '
              }
              return (
                <div key={index} className={_class} />
              )
            })
          }
          <button className='w3-button no-outline' onClick={this.next}> <i className='fa fa-arrow-right' /> </button>
        </div>
      </div>
    )
  }

  _renderFooter() {
    const _showSubmitBtn = this.state.check ? 'w3-hide' : '';
    const _showNextBtn = this.state.check ? '' : 'w3-hide';

    return (
      <footer className='w3-container w3-padding w3-border-top w3-white'>
        <button id="btn-submit" className={`w3-button w3-blue no-outline ${_showSubmitBtn}`} onClick={this.submit} > Submit </button>
        <button id="btn-next" className={`w3-button w3-teal no-outline ${_showNextBtn}`} onClick={this.next} > 
          Next <i className='fa fa-arrow-right' />
        </button>
        <button id="btn-hint" className='w3-button w3-right w3-text-blue no-outline'> Hint </button>
      </footer>
    )
  }

  onRadioChange(id, evt) {
    const quiz = this.quizs[this.state.index]

    const correctAnswer = quiz.answer;
    const answer = {};

    for (let qid in correctAnswer) {
      answer[qid] = false;
      if (qid === id) {
        answer[qid] = !this.state.answer[id];
      }
    }
    this.setState ({ answer, check: null })
  }

  onCheckBoxChange(id, evt) {
    const quiz = this.quizs[this.state.index]

    const correctAnswer = quiz.answer;
    const answer = this.state.answer;

    for (let qid in correctAnswer) {
      if (qid === id) {
        answer[qid] = !this.state.answer[id];
      }
    }
    this.setState ({ answer, check: null })
  }

  onTextChange(id, evt) {
    const quiz = this.quizs[this.state.index]

    const correctAnswer = quiz.answer;
    const answer = this.state.answer;

    for (let qid in correctAnswer) {
      if (qid === id) {
        answer[qid] = evt.target.value;
      }
    }
    this.setState ({ answer, check: null })
  }

  finish(id, evt) {
    this.props.finish(id);
  }

  renderQuestion(quiz) {
    
    const answer = quiz.answer;
    const prop = {};
    
    const deepClone = (el) => {
      let children = [];
      if (!_.isObject(el)) {
        return el;
      }
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => deepClone(child))
      }
      /* bind events to elmenent */
      if (el.props.id && el.props.id in answer) {
        return this._bindEventAndProp(el);
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

  _bindEventAndProp(el) {
    const prop = {}
    if (el.type && el.type === 'input') {
      const type = el.props.type || '';
      switch (type) {
        case 'radio':
          prop.onChange = (evt) => this.onRadioChange(el.props.id, evt);
          prop.checked = this.state.answer[el.props.id] || false;
          break
        case 'checkbox':
          prop.onChange = (evt) => this.onCheckBoxChange(el.props.id, evt);
          prop.checked = this.state.answer[el.props.id] || false;
          break
        case 'text':
          prop.style = { 
            padding: 0, 
            display: 'inline-block',
            ...el.props.style 
          };
          prop.className = 'w3-input w3-pale-yellow no-outline'
          prop.onKeyUp = (evt) => this.onTextChange(el.props.id, evt);
          break
        default:
          throw new Error('Only support radio, checkbox and text in answer input')
          break
      }
    } else {
      throw new Error('The answer must be an input type')
    }
    return this._wrapCheck(React.cloneElement(el, prop));
  }

  _wrapCheck(el) {
    const id = el.props.id;
    const quiz = this.quizs[this.state.index]
    const correctAnswer = quiz.answer;

    const display = this.state.check && (this.state.answer[id] || correctAnswer[id])? 'w3-show' : 'w3-hide';
    const color = this.state.check && this.state.check[id] ? 'w3-text-green' : 'w3-text-red'
    const correct =  this.state.check && this.state.check[id] ? 'fa-check' : 'fa-close'
    return (
      <label>
        <label style={{display:'inline-block', width: '16px', height: '16px'}}>
          <i className={`fa ${correct} ${display} ${color}`} />
        </label>
        {el}
      </label>
    )
  }

  next() {
    const index = this.state.index + 1;
    if (index < this.quizs.length) {
      this.setState({ index, answer: {}, check: null })
    } else {
      this.finish();
    }
    
  }

  previous() {
    const index = this.state.index - 1;
    if (index >= 0) {
      this.setState({ index, answer: {}, check: null  })
    }
    
  }

  submit() {
    this._checkAnswer();
  }

  _checkAnswer() {
    const quiz = this.quizs[this.state.index]
    const correctAnswer = quiz.answer;
    const check = {};
    let completed = true;

    // check if user has answer
    let answered = false;
    for (let id in this.state.answer) {
      if (this.state.answer[id]) {
        answered = true;
      }
    }
  
    if (!answered) {
      this.setState({ check: null });
      return
    }

    // check each answer correct or not
    for (let id in correctAnswer) {
      check[id] = true;
      let ans = this.state.answer[id] || false;
      if (typeof ans === 'string') {
        ans = ans.toLowerCase();
      }
      if (ans !== correctAnswer[id]) {
        check[id] = false;
        completed = false;
      }
    }
    quiz.completed = completed;
    this.setState({ check });
  }

}