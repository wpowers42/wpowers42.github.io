import {
  createEventListeners, clearResults, displayNoResults, createResults, displayResults,
} from './dom';

export default (query) => {
  const url = `https://willp.herokuapp.com/puns/${query}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      createEventListeners();
      if (!data.length) {
        clearResults();
        displayNoResults();
      } else {
        const results = createResults(data);
        displayResults(results);
      }
    });
};
