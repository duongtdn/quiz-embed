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

app.listen(3100)

console.log('Example Server is listening at localhost:3100')