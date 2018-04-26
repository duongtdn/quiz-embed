"use strict"

import React, { Component } from 'react'

import Player from './player'
import Quiz from './Quiz'

export default class QuizData extends Component {
  constructor(props) {
    super (props);
  }

  componentDidMount() {
    this.player = new Player();
  }

  render() {
    return (
      <Quiz />
    )
  }
}