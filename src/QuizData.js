"use strict"

import React, { Component } from 'react'

import Player from './player'
import Quiz from './Quiz'

export default class QuizData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      data: null
    }

    this.finish = this.finish.bind(this);

  }

  componentDidMount() {
    this.player = new Player({
      onError: this.onError.bind(this),
      onLoaded: this.onLoaded.bind(this)
    });
  }

  render() {
    return (
      <Quiz data = {this.state.data}
            error = {this.state.error}
            finish = {this.finish}
      />
    )
  }

  onError(error) {
    this.setState({ error })
  }

  onLoaded(data) {
    if (data && data.length > 0) {
      const sanitized = data.map( quiz => {
        if (quiz.question) {
          quiz.question = this.sanitize(quiz.question)
        }
        return quiz
      })
      this.setState({ data: sanitized })
    }
  }

  finish() {
    this.player.finish()
  }

  sanitize(str) {
    const sanitized = str.replace(/on\w*(\s+=|=)(\s+\"|\")\w*\W*(\s+\"|\")/igm, "")  // remove binded events
                         .replace(/\r?\n|\r/g,"")                                    // remove new line
                         .replace(/>\s+</g,"><")                                     // remove space between el
                         .trim();
    return sanitized
  }

}