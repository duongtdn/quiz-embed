"use strict"

const express = require('express')

const path = require('path');

const app = express();

app.get('/quiz_api', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/api.bundle.js'))
})

app.get('/player.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/player.bundle.js'))
})

app.get('/quiz/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/w3.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'css/w3.css'))
})

app.get('/quiz.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'css/quiz.css'))
})

app.listen(3400)

console.log('quiz-embed server is listening at localhost:3400')