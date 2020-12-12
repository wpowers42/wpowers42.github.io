'use strict';

const clearResults = () => {
  const searchResults = document.querySelector('.search-results');
  searchResults.innerHTML = '';
  const noResults = document.querySelectorAll('.movie-no-results');
  Array.from(noResults).forEach((div) => div.remove());
};

const createResults = (data) => {
  const frag = document.createDocumentFragment();
  const sort = (a, b) => {
    if (a.votes === b.votes) {
      return b.word.length - a.word.length;
    }
    return b.votes - a.votes;
  };
  const titles = [];
  const filter = (a) => {
    if (!titles.includes(a.title)) {
      titles.push(a.title);
      return true;
    }
    return false;
  };
  data.sort(sort).filter(filter).forEach((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.className = 'movie-container';
    const editedTitle = document.createElement('div');
    editedTitle.className = 'movie-edited-title';
    editedTitle.textContent = movie.edited_title;
    movieContainer.append(editedTitle);
    frag.appendChild(movieContainer);
  });
  return frag;
};

const displayResults = (frag) => {
  const searchResults = document.querySelector('.search-results');
  searchResults.appendChild(frag.cloneNode(true));
};

const displayNoResults = () => {
  const body = document.querySelector('body');
  const noResults = document.createElement('div');
  noResults.className = 'movie-no-results';
  noResults.textContent = 'No Results :(';
  body.append(noResults);
};

const createEventListeners = () => {
  const searchResults = document.querySelector('.search-results');
  searchResults.addEventListener('click', (event) => {
    if (event.target.className === 'movie-container') {
      event.target.classList.toggle('favorite');
    } else if (event.target.className === 'movie-edited-title') {
      event.target.parentElement.classList.toggle('favorite');
    }
  });
};

var getRhymes = (query) => {
  const url = `https://willp.herokuapp.com/puns/${query}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      createEventListeners();
      clearResults();
      if (!data.length) {
        displayNoResults();
      } else {
        const results = createResults(data);
        displayResults(results);
      }
    });
};

(function main() {
  const searchBox = document.querySelector('.search-box');
  searchBox.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      const query = event.target.value.toLowerCase();
      getRhymes(query);
    }
  });
}());
