"use strict"

const ORIGIN = 'http://localhost:3100';


console.log('player script')

function receiveMessage(e) {

  updateDom(e.origin, e.data)

  e.source.postMessage('quizPlayer.pong', e.origin)

  e.source.postMessage('quizPlayer.loaded', e.origin)

}

function updateDom(o, d) {
  const origin = document.getElementById('origin')
  const data = document.getElementById('data')

  origin.innerHTML = o;
  data.innerHTML = d;
}

updateDom('the origin', 'the data')

window.addEventListener('message', receiveMessage);