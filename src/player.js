"use strict"

import validate from './validate'

const ORIGIN = 'http://localhost:3100';


console.log('player script')

function receiveMessage(e) {
  updateDom(e.origin, e.data)

  switch (validate(e.data)) {
    case 'ping':
      notifyReady(e);
      break;
    case 'load':
      notifyLoaded(e);
      break;
    default:
      break;
  }

}

function updateDom(o, d) {
  const origin = document.getElementById('origin')
  const data = document.getElementById('data')

  origin.innerHTML = o;
  data.innerHTML = d;
}

function notifyReady({source, origin}) {
  source.postMessage('quizPlayer.pong', origin)
}

function notifyLoaded({source, origin, data}) {
  const [cmd, src] = data.split('/')
  source.postMessage('quizPlayer.loaded', origin)
}

updateDom('the origin', 'the data')

window.addEventListener('message', receiveMessage);