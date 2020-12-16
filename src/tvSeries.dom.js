/* eslint-disable no-param-reassign */
const updateSuggestions = (container, fuzzyhound, input) => {
  const results = fuzzyhound.search(input.value);
  const frag = document.createDocumentFragment();
  if (results.length) {
    container.classList.add('active');
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
  container.innerHTML = '';
  container.appendChild(frag);
};

export { updateSuggestions };
