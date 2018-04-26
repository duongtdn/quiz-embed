"use strict"
const getClass = {}.toString;
const _ = {};

['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object']
.forEach( name => {
  _[`is${name}`] = function (obj) {
    return obj && getClass.call(obj) == `[object ${name}]`;
  };
});

export default function(message) {

  if (!_.isString(message)) {
    return false
  }
  
  if (message === 'quizApi.ping') {
    return 'ping'
  }

  if (/quizApi.load\/.+$/.test(message)) {
    return 'load'
  }


}


