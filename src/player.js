"use strict"

import { validate } from './util'

const ORIGIN = 'http://localhost:3100';

export default class {
  constructor(events) {
    this.events = events;
    window.addEventListener('message', this.receiveMessage.bind(this));

    this.notifyBodyHeight = this.notifyBodyHeight.bind(this);
  }

  receiveMessage(e) {

    this._evt = e;

    switch (validate(e.data)) {
      case 'ping':
        this.notifyReady();
        break;
      case 'load':
        this.loadQuiz();
        break;
      default:
        break;
    }
  
  }

  notifyReady() {
    const {source, origin} = this._evt;
    if (!source) { return }
    source.postMessage('quizPlayer.pong', origin)
  }

  loadQuiz() { 
    const {source, origin, data} = this._evt;
    if (!source && !data) { return }
    const [cmd, src] = data.split('/')
    /* asyn load content */
    this.getQuizData(src, (err, data) => {
      if (err) {
        this.events && this.events.onError && this.events.onError(err)
        source.postMessage('quizPlayer.error', origin)
      } else {
        this.events && this.events.onLoaded && this.events.onLoaded(data)
        source.postMessage('quizPlayer.loaded', origin)
      }
    })
  }

  getQuizData(src, done) {
    const question1 = `
      <div> 
        <p> Select an answer for this question </p>
        <p> What are your gender </p>
        <form class="">
          <p>
            <input id="$0" class="w3-radio" type="radio" name="gender" onchange="xss()" value="male">
            <label>Male</label>
          </p>
          <p>
            <input id="$1" class="w3-radio" type="radio" name="gender" ONKEYPRESS = "xss()" value="female">
            <label>Female</label>
          </p>
          <p>
            <input id="$2" class="w3-radio" type="radio" name="gender" ONKEYPRESS = "xss()" value="female">
            <label>Other</label>
          </p>
        </form>

      </div>
    `

    const question2 = `
      <div> 
        <p> Select an answer for this question </p>
        <p> What is your job </p>
        <form >
          <p>
            <input id="$0" class="w3-radio" type="radio" name="gender" onchange="xss()" value="Engineer">
            <label>Engineer</label>
          </p>
          <p>
            <input id="$1" class="w3-radio" type="radio" name="gender" ONKEYPRESS = "xss()" value="Doctor">
            <label>Doctor</label>
          </p>
          <p>
            <input id="$2" class="w3-radio" type="radio" name="gender" ONKEYPRESS = "xss()" value="female">
            <label>Other</label>
          </p>
        </form>
        
      </div>
    `
    const data1 = [
      {
        title: 'Quiz 1: What is your gender?',
        question: question1,
        answer: {
          '$0': true,
          '$1': false,
          '$2': false
        }
      },
      {
        title: 'Quiz 2: What is your job',
        question: question2,
        answer: {
          '$0': true,
          '$1': false,
          '$2': false
        }
      }
    ]

    const data2 = 
      {
        title: 'Quiz 2',
        question: question2,
        answer: {
          '$0': true,
          '$1': false,
          '$2': false
        }
      }
    

    const data = {
      'quiz1': data1,
      'quiz2': data2
    }

    setTimeout(() => done(null, data[src]), 300);
  }

  finish(id) {
    const {source, origin} = this._evt;
    if (!source) { return }
    source.postMessage('quizPlayer.finish', origin)
  }

  notifyBodyHeight() {
    if (!this._evt) { return }
    const {source, origin} = this._evt;
    if (!source) { return }

    const height = document.body.scrollHeight;
    if (parseInt(height) === 0) { return }

    source.postMessage(`quizPlayer.height/${height}`, origin)
    
  }

}