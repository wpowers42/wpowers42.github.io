/* eslint-disable no-underscore-dangle */
import Heatmap from './tvSeries.heatmap';
import { getEpisodes } from './tvSeries.grid';

// eslint-disable-next-line no-undef
const fuzzyhound = new FuzzySearch({ output_limit: 6, output_map: 'alias' });

fetch('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/json/series.json')
  .then((res) => res.json())
  .then((data) => {
    fuzzyhound.setOptions({
      source: data,
      keys: { title: 'title' },
      output_map: 'item',
      token_field_min_length: 2,
    });
  });

const suggestions = document.querySelector('.search-suggestions');
const searchInput = document.querySelector('#search-input');

const updateSuggestions = (value) => {
  const results = fuzzyhound.search(value);
  const frag = document.createDocumentFragment();
  if (results.length) {
    suggestions.classList.add('active');
  }
  results.forEach((result) => {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    resultContainer.setAttribute('data-tconst', result.tconst);
    resultContainer.setAttribute('data-title', result.title);
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    titleContainer.innerHTML = fuzzyhound.highlight(result.title, 'title');
    const yearsContainer = document.createElement('div');
    yearsContainer.className = 'years-container';
    yearsContainer.innerText = result.years;
    resultContainer.append(titleContainer);
    resultContainer.append(yearsContainer);
    frag.appendChild(resultContainer);
  });
  suggestions.innerHTML = '';
  suggestions.appendChild(frag);
};

searchInput.addEventListener('input', (event) => {
  const { value } = event.target;
  updateSuggestions(value);
});

searchInput.addEventListener('focusin', () => {
  searchInput.value = '';
});

const highlightSuggestion = (event) => {
  // eslint-disable-next-line no-nested-ternary
  const direction = event.which === 40 ? 1 : event.which === 38 ? -1 : 0;
  if (suggestions.length === 0) return;
  const selected = document.querySelector('.selected');
  let next;
  if (selected) {
    selected.classList.remove('selected');
    if (direction === 1) {
      next = selected.nextSibling ? selected.nextSibling : suggestions.firstChild;
    } else if (direction === -1) {
      next = selected.previousSibling ? selected.previousSibling : suggestions.lastChild;
    }
  } else if (direction === 1) {
    next = suggestions.firstChild;
  } else if (direction === -1) {
    next = suggestions.lastChild;
  }
  if (next) {
    next.classList.add('selected');
    const title = next.getAttribute('data-title');
    searchInput.value = title;
  }
};

const submitSelection = () => {
  const selected = document.querySelector('.selected');
  const tconst = selected.getAttribute('data-tconst');
  suggestions.classList.remove('active');
  suggestions.innerHTML = '';
  searchInput.blur();
  const url = `https://willp.herokuapp.com/tv-series/${tconst.toString()}`;
  // eslint-disable-next-line no-unused-vars
  // const hm = new Heatmap(url);
  getEpisodes(tconst);
};

window.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    submitSelection(event);
  }
});
window.addEventListener('keydown', (event) => highlightSuggestion(event));

suggestions.addEventListener('click', (event) => {
  submitSelection(event);
});

suggestions.addEventListener('mouseover', (event) => {
  const { parentElement } = event.target;
  if (parentElement.classList.contains('result-container')) {
    Array.from(suggestions.children).forEach((child) => {
      child.classList.remove('selected');
    });
    parentElement.classList.add('selected');
  }
});
