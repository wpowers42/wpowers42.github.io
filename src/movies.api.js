import {
  createEventListeners, clearResults, displayNoResults, createResults, displayResults,
} from './movie.dom.js';

export default (query) => {
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
