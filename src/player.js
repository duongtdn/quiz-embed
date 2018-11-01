"use strict"

import { validate } from './util'

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
    const src = data.replace(/quizApi.load\//,'')
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
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status >= 400) {
          done && done(this.status, null)
        } else {
          const data = JSON.parse(this.responseText);
          done && done(null, data.quiz)
        }
        
      }
    }
    xhttp.open("GET", src)
    xhttp.send();
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

    source.postMessage(`quizPlayer.height/${height+2}`, origin)
    
  }

}