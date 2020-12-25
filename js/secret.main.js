'use strict';

/* eslint-disable no-param-reassign */
const createNumpad = (pattern) => ({
  pattern: pattern.toString().split(''),
  userPattern: [],
  unlocked: false,
  patternsMatch: false,
});

const comparePatterns = (numpad, entry) => {
  if (numpad.unlocked) return;
  numpad.userPattern.push(entry);
  if (numpad.pattern.join('') === numpad.userPattern.join('')) {
    // patterns fully match
    numpad.unlocked = true;
    numpad.patternsMatch = true;
    return;
  }
  // check for partial match
  // eslint-disable-next-line consistent-return
  numpad.pattern.forEach((pat, index) => {
    if (numpad.userPattern.length > index) {
      if (!(numpad.userPattern[index] === pat)) {
        // patterns don't match, reset
        numpad.userPattern = [];
        numpad.patternsMatch = false;
      } else {
        numpad.patternsMatch = true;
      }
    }
  });
};

// eslint-disable-next-line no-alert
const urlParams = new URLSearchParams(window.location.search);
const code = parseInt(urlParams.get('c'), 36);
// 1112745 default
const numpad = createNumpad(code);

document.querySelector('.numpad').addEventListener('click', (event) => {
  const body = document.querySelector('body');
  if (!numpad.unlocked) {
    body.classList.remove('incorrect');
  }
  if (event.target.classList.contains('num')) {
    comparePatterns(numpad, event.target.dataset.value);
    if (numpad.unlocked) {
      body.classList.add('unlocked');
      document.querySelector('.numpad').classList.add('blur');
    } else if (!numpad.patternsMatch) {
      body.classList.remove('incorrect');
      // eslint-disable-next-line no-void
      void body.offsetWidth;
      body.classList.add('incorrect');
    }
  }
});
