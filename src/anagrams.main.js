const shuffle = (array) => {
  let currentIndex = array.length; let temporaryValue; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const ANAGRAMS = [
  ['POSTERIOR', ['T']],
  ['BACKSIDE', ['D']],
  ['DERRIERE', ['D']],
  ['CABOOSE', ['O']],
  ['APPLEBOTTOM', ['L', 'M']],
  ['BADONKADONK', ['O']],
  ['JUICY', ['I']],
  ['BUTT', ['B']],
  ['BOOTY', ['Y']],
  ['CHEEKS', ['H']],
  ['FLATULENCE', ['F', 'L', 'U']],
];

const SOLUTION = 'FILTHY MUDBLOOD';

const addSolutionInputs = (solution = SOLUTION) => {
  const solutionContainer = document.querySelector('.solution');
  const frag = document.createDocumentFragment();
  solution.split('').forEach((letter) => {
    const letterElement = document.createElement('input');
    letterElement.maxLength = 1;
    letterElement.className = 'solution-letter';
    letterElement.setAttribute('data-letter', letter);
    if (letter === ' ') {
      letterElement.style.visibility = 'hidden';
      letterElement.value = ' ';
      // letterElement.style.whiteSpace = 'pre';
    }
    frag.appendChild(letterElement);
  });
  solutionContainer.appendChild(frag);
};

const scramble = (word) => shuffle(word.split('')).join('');

const createSolution = (word, highlights) => {
  const solutionContainer = document.createElement('div');
  solutionContainer.className = 'anagram-solution hidden';
  word.split('').forEach((letter) => {
    if (highlights.includes(letter)) {
      const highlight = document.createElement('div');
      highlight.className = 'anagram-solution-highlight';
      highlight.textContent = letter;
      solutionContainer.appendChild(highlight);
      const index = highlights.indexOf(letter);
      highlights.splice(index, 1);
    } else {
      solutionContainer.appendChild(document.createTextNode(letter));
    }
  });
  return solutionContainer;
};

const createAnagram = (word) => {
  const w = word[0];
  const highlights = word[1];
  const container = document.createElement('div');
  container.className = 'anagram-container';
  container.setAttribute('data-answer', w);
  const anagram = document.createElement('div');
  anagram.className = 'anagram';
  anagram.textContent = scramble(w);
  const input = document.createElement('input');
  input.className = 'anagram-input';
  const anagramSolution = createSolution(w, highlights);
  container.append(anagram);
  container.append(input);
  container.append(anagramSolution);
  return container;
};

const createBoard = () => {
  const elements = shuffle(ANAGRAMS).map((word) => createAnagram(word));
  document.querySelector('.board').append(...elements);
};

const endGame = () => {
  document.querySelector('.board').classList.add('blur');
  document.querySelector('.button.continue').classList.add('unlocked');
};

const isGameComplete = () => {
  const solutions = Array.from(document.querySelectorAll('.anagram-solution'));
  const solutionsFound = solutions.reduce((acc, cur) => (acc + (cur.className.includes('revealed') ? 1 : 0)), 0);
  return solutionsFound === solutions.length;
};

const checkInput = (event) => {
  if (event.target.className.includes('anagram-input')) {
    const solution = event.target.parentElement.dataset.answer;
    const guess = event.target.value.toUpperCase();
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

const solutionFound = () => {
  if (document.activeElement !== document.body) document.activeElement.blur();
  const letters = Array.from(document.querySelectorAll('.solution-letter'));
  letters.forEach((ele) => {
    // eslint-disable-next-line no-param-reassign
    ele.readOnly = true;
    // eslint-disable-next-line no-param-reassign
    ele.style.pointerEvents = 'none';
  });
  const message = document.querySelector('.solution-message');
  message.style.visibility = 'visible';
  const anagrams = Array.from(document.querySelectorAll('.anagram'));
  anagrams.forEach((anagram) => {
    // eslint-disable-next-line no-param-reassign
    anagram.style.color = 'white';
  });
  const solutions = Array.from(document.querySelectorAll('.anagram-solution'));
  solutions.forEach((solution) => {
    // eslint-disable-next-line no-param-reassign
    solution.style.color = 'white';
  });
  const body = document.querySelector('body');
  body.style.backgroundImage = "url('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/images/mudblood.gif')";
};

const checkSolution = (event) => {
  if (event.target.className.includes('solution-letter')) {
    const letters = Array.from(document.querySelectorAll('.solution-letter'));
    const solution = letters.map((ele) => ele.dataset.letter).join('');
    const guess = letters.map((ele) => ele.value.toUpperCase()).join('');
    if (solution === guess) {
      solutionFound();
    }
  }
};

const moveCursor = (event) => {
  if (event.target.className.includes('solution-letter')) {
    let nextNode = event.target.nextSibling;
    if (!nextNode) {
      nextNode = event.target.parentElement.firstChild;
    }
    if (nextNode.dataset.letter === ' ') {
      nextNode = nextNode.nextSibling;
    }
    nextNode.focus();
  }
};

const selectOnFocus = (event) => {
  if (event.target.className.includes('solution-letter')) {
    event.target.select();
  }
};

const createEventListeners = () => {
  const board = document.querySelector('.board');
  board.addEventListener('input', checkInput);
  const solutionContainer = document.querySelector('.solution');
  solutionContainer.addEventListener('input', moveCursor);
  solutionContainer.addEventListener('input', checkSolution);
  solutionContainer.addEventListener('focusin', selectOnFocus);
};

createBoard();
createEventListeners();
addSolutionInputs();
