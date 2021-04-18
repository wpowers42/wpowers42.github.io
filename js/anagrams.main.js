'use strict';

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var shuffle = function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex; // While there remain elements to shuffle...

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

var ANAGRAMS = [['POSTERIOR', ['T']], ['BACKSIDE', ['D']], ['DERRIERE', ['D']], ['CABOOSE', ['O']], ['APPLEBOTTOM', ['L', 'M']], ['BADONKADONK', ['O']], ['JUICY', ['I']], ['BUTT', ['B']], ['BOOTY', ['Y']], ['CHEEKS', ['H']], ['FLATULENCE', ['F', 'L', 'U']]];
var SOLUTION = 'FILTHY MUDBLOOD';

var addSolutionInputs = function addSolutionInputs() {
  var solution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SOLUTION;
  var solutionContainer = document.querySelector('.solution');
  var frag = document.createDocumentFragment();
  solution.split('').forEach(function (letter) {
    var letterElement = document.createElement('input');
    letterElement.maxLength = 1;
    letterElement.className = 'solution-letter';
    letterElement.setAttribute('data-letter', letter);

    if (letter === ' ') {
      letterElement.style.visibility = 'hidden';
      letterElement.value = ' '; // letterElement.style.whiteSpace = 'pre';
    }

    frag.appendChild(letterElement);
  });
  solutionContainer.appendChild(frag);
};

var scramble = function scramble(word) {
  return shuffle(word.split('')).join('');
};

var createSolution = function createSolution(word, highlights) {
  var solutionContainer = document.createElement('div');
  solutionContainer.className = 'anagram-solution hidden';
  word.split('').forEach(function (letter) {
    if (highlights.includes(letter)) {
      var highlight = document.createElement('div');
      highlight.className = 'anagram-solution-highlight';
      highlight.textContent = letter;
      solutionContainer.appendChild(highlight);
      var index = highlights.indexOf(letter);
      highlights.splice(index, 1);
    } else {
      solutionContainer.appendChild(document.createTextNode(letter));
    }
  });
  return solutionContainer;
};

var createAnagram = function createAnagram(word) {
  var w = word[0];
  var highlights = word[1];
  var container = document.createElement('div');
  container.className = 'anagram-container';
  container.setAttribute('data-answer', w);
  var anagram = document.createElement('div');
  anagram.className = 'anagram';
  anagram.textContent = scramble(w);
  var input = document.createElement('input');
  input.className = 'anagram-input';
  var anagramSolution = createSolution(w, highlights);
  container.append(anagram);
  container.append(input);
  container.append(anagramSolution);
  return container;
};

var createBoard = function createBoard() {
  var _document$querySelect;

  var elements = shuffle(ANAGRAMS).map(function (word) {
    return createAnagram(word);
  });

  (_document$querySelect = document.querySelector('.board')).append.apply(_document$querySelect, _toConsumableArray(elements));
};

var endGame = function endGame() {
  document.querySelector('.board').classList.add('blur');
  document.querySelector('.button.continue').classList.add('unlocked');
};

var isGameComplete = function isGameComplete() {
  var solutions = Array.from(document.querySelectorAll('.anagram-solution'));
  var solutionsFound = solutions.reduce(function (acc, cur) {
    return acc + (cur.className.includes('revealed') ? 1 : 0);
  }, 0);
  return solutionsFound === solutions.length;
};

var checkInput = function checkInput(event) {
  if (event.target.className.includes('anagram-input')) {
    var solution = event.target.parentElement.dataset.answer;
    var guess = event.target.value.toUpperCase();

    if (guess === solution) {
      event.target.classList.add('hidden');
      event.target.parentElement.firstChild.classList.add('hidden');
      event.target.parentElement.lastChild.classList.remove('hidden');

      if (isGameComplete()) {
        endGame();
      }
    }
  }
};

var solutionFound = function solutionFound() {
  if (document.activeElement !== document.body) document.activeElement.blur();
  var letters = Array.from(document.querySelectorAll('.solution-letter'));
  letters.forEach(function (ele) {
    // eslint-disable-next-line no-param-reassign
    ele.readOnly = true; // eslint-disable-next-line no-param-reassign

    ele.style.pointerEvents = 'none';
  });
  var message = document.querySelector('.solution-message');
  message.style.visibility = 'visible';
  var anagrams = Array.from(document.querySelectorAll('.anagram'));
  anagrams.forEach(function (anagram) {
    // eslint-disable-next-line no-param-reassign
    anagram.style.color = 'white';
  });
  var solutions = Array.from(document.querySelectorAll('.anagram-solution'));
  solutions.forEach(function (solution) {
    // eslint-disable-next-line no-param-reassign
    solution.style.color = 'white';
  });
  var body = document.querySelector('body');
  body.style.backgroundImage = "url('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/images/mudblood.gif')";
};

var checkSolution = function checkSolution(event) {
  if (event.target.className.includes('solution-letter')) {
    var letters = Array.from(document.querySelectorAll('.solution-letter'));
    var solution = letters.map(function (ele) {
      return ele.dataset.letter;
    }).join('');
    var guess = letters.map(function (ele) {
      return ele.value.toUpperCase();
    }).join('');

    if (solution === guess) {
      solutionFound();
    }
  }
};

var moveCursor = function moveCursor(event) {
  if (event.target.className.includes('solution-letter')) {
    var nextNode = event.target.nextSibling;

    if (!nextNode) {
      nextNode = event.target.parentElement.firstChild;
    }

    if (nextNode.dataset.letter === ' ') {
      nextNode = nextNode.nextSibling;
    }

    nextNode.focus();
  }
};

var selectOnFocus = function selectOnFocus(event) {
  if (event.target.className.includes('solution-letter')) {
    event.target.select();
  }
};

var createEventListeners = function createEventListeners() {
  var board = document.querySelector('.board');
  board.addEventListener('input', checkInput);
  var solutionContainer = document.querySelector('.solution');
  solutionContainer.addEventListener('input', moveCursor);
  solutionContainer.addEventListener('input', checkSolution);
  solutionContainer.addEventListener('focusin', selectOnFocus);
};

createBoard();
createEventListeners();
addSolutionInputs();
