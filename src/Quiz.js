"use strict"

import React, { Component } from 'react'

import Player from './player'

export default class Quiz extends Component {
  constructor(props) {
    super (props);
  }

  componentDidMount() {
    this.player = new Player();
  }

  render() {
    return (
      <div>
        Hello Quiz
      </div>
    )
  }
}