"use strict"

const SRC = 'http://localhost:3000/quiz/index.html';

const QUIZ_ORIGIN = 'http://localhost:3000';

export default class Player {
  constructor(playerId, { playerVars, events }) {

    if (!playerVars) {
      playerVars = {};
    }

    const iframeSrc = playerVars.iframeSrc || SRC;
    this.quizOrigin = playerVars.origin || QUIZ_ORIGIN;

    const div = document.getElementById(playerId);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', playerId);
    iframe.setAttribute('src', iframeSrc)
    iframe.style.border = '1px solid #aaa'
    iframe.style.width = '100%'

    div.parentNode.replaceChild(iframe, div);

    this.iframe = iframe;

    /* store content windoe handler */
    this.quizWindow = iframe.contentWindow;

    this.events = events || {};

    window.addEventListener('message', this._receiveMessage.bind(this));

    this._establishConnection();

  }

  load(src) {
    this._post(`quizApi.load/${src}`)
  }

  _receiveMessage(e) {
    if (e.origin !== this.quizOrigin) {
      return
    }
    switch (e.data) {
      case 'quizPlayer.pong':
        this._onPlayerReady()
        break
      case 'quizPlayer.loaded':
        this.events && this.events.onLoaded && this.events.onLoaded();
        break
      case 'quizPlayer.error':
        this.events && this.events.onError && this.events.onError();
        break
      case 'quizPlayer.finish':
      this.events && this.events.onFinished && this.events.onFinished();
        break
      default:
        break
    }

    if (/^quizPlayer.height/.test(e.data)) {
      const [cmd, height] = e.data.split('/');
      this.iframe.style.height = height + 'px';
      this.events && this.events.onResize && this.events.onResize(height);
    }

  }

  _post(message) {
    this.quizWindow.postMessage(message, this.quizOrigin);
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

  _onPlayerReady() {
    this.tm && clearInterval(this.tm);
    this.events && this.events.onReady && this.events.onReady();
  }

}