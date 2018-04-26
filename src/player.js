"use strict"

import validate from './validate'

const ORIGIN = 'http://localhost:3100';

export default class {
  constructor() {
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
    this.getQuizData(src, (err) => {
      if (err) {
        source.postMessage('quizPlayer.error', origin)
      } else {
        source.postMessage('quizPlayer.loaded', origin)
      }
    })
  }

  getQuizData(src, done) {
    setTimeout(() => done(), 1000);
  }

}