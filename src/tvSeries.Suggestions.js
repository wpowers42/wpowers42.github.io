import { getEpisodes } from './tvSeries.grid';

export default class Suggestions {
  // pass in the search input box and suggestions div
  constructor(input, container) {
    this.input = input;
    this.query = null;
    this.selection = 0;
    this.container = container;
    // eslint-disable-next-line no-undef
    this.fuzzyhound = new FuzzySearch({ output_limit: 6, output_map: 'alias' });
    // load the tv series data
    this.seriesData();
  }

  // get the tv series json and load into fuzzyhound
  seriesData() {
    fetch('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/json/series.json')
      .then((res) => res.json())
      .then((data) => {
        this.fuzzyhound.setOptions({
          source: data,
          keys: { title: 'title' },
          output_map: 'item',
          token_field_min_length: 2,
        });
      });
  }

  highlightSelection(priorSelection, explicit = false) {
    // get result elements
    const results = Array.from(this.container.children);
    // if the last selection wasn't input field, remove selected
    if (priorSelection !== 0) {
      results[priorSelection - 1].classList.remove('selected');
    } else {
      this.query = this.input.value; // save to restore query later
    }

    // if new selection isn't input field, add selected class
    if (this.selection !== 0) {
      const selection = results[this.selection - 1];
      selection.classList.add('selected');
      if (!explicit) this.input.value = selection.getAttribute('data-title');
    } else {
      this.input.value = this.query; // restore query
    }
  }

  updateSelection(direction, explicit = null) {
    if (!direction && typeof (direction) === 'number') return;
    // add rule to return if not results available
    const priorSelection = this.selection;
    this.selection += direction;
    if (this.selection < 0) {
      this.selection = this.fuzzyhound.results.length;
    } else if (this.selection > this.fuzzyhound.results.length) {
      this.selection = 0;
    }
    if (explicit) {
      this.selection = explicit;
    }
    this.highlightSelection(priorSelection, explicit);
  }

  update() {
    const results = this.fuzzyhound.search(this.input.value);
    const frag = document.createDocumentFragment();
    if (results.length) {
      this.container.classList.add('active');
    }
    results.forEach((result) => {
      const resultContainer = document.createElement('div');
      resultContainer.className = 'result-container';
      resultContainer.setAttribute('data-tconst', result.tconst);
      resultContainer.setAttribute('data-title', result.title);
      const titleContainer = document.createElement('div');
      titleContainer.className = 'title-container';
      titleContainer.innerHTML = this.fuzzyhound.highlight(result.title, 'title');
      const yearsContainer = document.createElement('div');
      yearsContainer.className = 'years-container';
      yearsContainer.innerText = result.years;
      resultContainer.append(titleContainer);
      resultContainer.append(yearsContainer);
      frag.appendChild(resultContainer);
    });
    this.container.innerHTML = '';
    this.container.appendChild(frag);
  }

  submit() {
    const selected = document.querySelector('.selected');
    const tconst = selected.getAttribute('data-tconst');
    const title = selected.getAttribute('data-title');
    this.input.value = title;
    this.container.classList.remove('active');
    this.container.innerHTML = '';
    this.container.blur();
    getEpisodes(tconst);
  }
}
