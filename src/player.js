"use strict"

import { validate } from './util'

const ORIGIN = 'http://localhost:3100';

export default class {
  constructor(events) {
    this.events = events;
    window.addEventListener('message', this.receiveMessage.bind(this));
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
    const question = `
      <div> 
        <p> Select an answer for this question </p>
        <p> What are your gender </p>
        <form class="w3-container w3-card-4">
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
        <hr />
        <button id="btn-continue">Continue</button>
      </div>
    `
    const data = {
      question,
      answer: {
        '$0': true,
        '$1': false,
        '$2': false
      }
    }
    setTimeout(() => done(null, data), 1000);
  }

  finish(id) {
    const {source, origin} = this._evt;
    if (!source) { return }
    source.postMessage('quizPlayer.finish', origin)
  }

}