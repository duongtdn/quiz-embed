"use strict"

const SRC = 'http://localhost:3100/quiz/index.html';

const QUIZ_ORIGIN = 'http://localhost:3100';

export default class Player {
  constructor(playerId, { playerVars, events }) {

    /* create quiz player
      replace <div /> with an <iframe />
      use postMessage to communicate with iframe window
    */
   const div = document.getElementById(playerId);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', playerId);
    iframe.setAttribute('src', SRC)

    div.parentNode.replaceChild(iframe, div);

    /* store content windoe handler */
    this.quizWindow = iframe.contentWindow;

    this.events = events || {};

    window.addEventListener('message', this._receiveMessage.bind(this));

    this._establishConnection();

  }

  load() {

  }

  _receiveMessage(e) {
    if (e.origin !== QUIZ_ORIGIN) {
      return
    }
    switch (e.data) {
      case 'quizPlayer.pong':
        this.tm && clearInterval(this.tm);
        this.events && this.events.onReady && this.events.onReady();
        break;
      case 'quizPlayer.loaded':
        this.events && this.events.onLoaded && this.events.onLoaded();
        break;
      default:
        break;
    }
  }

  _post(message) {
    this.quizWindow.postMessage(message, QUIZ_ORIGIN);
    return this;
  }

  _establishConnection() {
    this.tm = setInterval(() => {
      this._ping()
    },1000);
  }

  _ping() {    
    return this._post('quizApi.ping');
  }

}