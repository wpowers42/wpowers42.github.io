'use strict';

const colorscaleValue = [
  [0.00, { r: 238, g: 238, b: 238 }],
  [0.01, { r: 210, g: 34, b: 45 }],
  [0.40, { r: 210, g: 34, b: 45 }],
  [0.65, { r: 255, g: 191, b: 0 }],
  [1.00, { r: 35, g: 136, b: 35 }],
];

const numInRange = (pct, numStart, numEnd) => numStart - (numStart - numEnd) * pct;

const ratingColorScale = (colorArr, ratingPct) => {
  const low = [...[...colorArr].reverse().find((color) => color[0] <= ratingPct)];
  const high = [...colorArr.find((color) => color[0] >= ratingPct)];
  return ([low, high]);
};
const getColor = (rating, colorArr = colorscaleValue) => {
  const ratingPct = rating / 10;
  const [low, high] = ratingColorScale(colorArr, ratingPct);
  const rangePct = (ratingPct - low[0]) / (high[0] - low[0]);
  const color = {};
  ['r', 'g', 'b'].forEach((c) => {
    const c1 = low[1][c];
    const c2 = high[1][c];
    const c3 = c1 === c2 ? c1 : numInRange(rangePct, c1, c2);
    color[c] = c3;
  });
  return color;
};

const createEpisodeDetail = (episode) => {
  // container
  const episodeDetail = document.createElement('div');
  episodeDetail.className = 'episode-detail';

  // Season and Episode
  const seasonEpisode = document.createElement('div');
  seasonEpisode.textContent = `S${episode.season_number} E${episode.episode_number}`;
  seasonEpisode.className = 'episode-detail-season-episode';

  // Title and Year
  const titleYear = document.createElement('div');
  titleYear.textContent = `${episode.primary_title} (${episode.start_year})`;
  titleYear.className = 'episode-detail-title-year';

  // Rating and Votes
  const ratingVotes = document.createElement('div');
  ratingVotes.textContent = `${episode.average_rating}/10 (${episode.number_votes} votes)`;
  ratingVotes.className = 'episode-detail-rating-votes';

  // parent_tconst
  // tconst

  // appends
  episodeDetail.append(seasonEpisode);
  episodeDetail.append(titleYear);
  episodeDetail.append(ratingVotes);

  // return
  return episodeDetail;
};

const createLabels = (labels, grid, type) => {
  labels.forEach((label) => {
    const labelCell = document.createElement('div');
    labelCell.className = `label-${type}`;
    labelCell.textContent = label;
    labelCell.style['grid-column'] = type === 'row' ? 1 : 1 + label;
    labelCell.style['grid-row'] = type === 'row' ? labels.length + 1 - label : -2;
    grid.append(labelCell);
  });
};

const createGrid = (data) => {
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';
  const columns = Math.max(...data.map((o) => o.season_number)) + 1;
  const rows = Math.max(...data.map((o) => o.episode_number)) + 1;
  const maxColumnWidth = 100;
  const maxWidth = columns * maxColumnWidth;
  const maxRowHeight = 100;
  const maxHeight = rows * maxRowHeight;

  const gridCss = {
    width: `${maxWidth}px`,
    'max-width': '90%',
    height: `${maxHeight}px`,
    'max-height': '70vh',
    'grid-template-columns': `20px repeat(${columns}, ${100 / (columns - 1)}%)`,
    'grid-template-rows': `repeat(${rows}, ${100 / rows}%)`,
  };
  Object.keys(gridCss).forEach((style) => {
    grid.style[style] = gridCss[style];
  });

  const columnLabels = [...Array(columns - 1).keys()].map((i) => i + 1);
  const rowLabels = [...Array(rows - 1).keys()].map((i) => i + 1);
  createLabels(columnLabels, grid, 'column');
  createLabels(rowLabels, grid, 'row');

  data.forEach((episode) => {
    if (!episode.season_number || !episode.episode_number) return;
    const episodeCell = document.createElement('div');
    episodeCell.className = 'episode-cell';
    episodeCell.setAttribute('data-tconst', episode.tconst);
    episodeCell.setAttribute('data-title', episode.primary_title);
    episodeCell.setAttribute('data-year', episode.start_year);
    episodeCell.setAttribute('data-season', episode.season_number);
    episodeCell.setAttribute('data-episode', episode.episode_number);
    episodeCell.setAttribute('data-rating', episode.average_rating);
    episodeCell.setAttribute('data-votes', episode.number_votes);
    const episodeDetail = createEpisodeDetail(episode);
    const tooltipPosition = episode.season_number / columns > 0.50 ? 'left' : 'right';
    episodeDetail.classList.add(`tooltip-${tooltipPosition}`);
    const rgb = getColor(episode.average_rating);
    const episodeCss = {
      'grid-column': episode.season_number + 1,
      'grid-row': -episode.episode_number + rows,
      'background-color': `rgb(${rgb.r},${rgb.g},${rgb.b})`,
    };
    Object.keys(episodeCss).forEach((style) => {
      episodeCell.style[style] = episodeCss[style];
    });
    // episodeCell.append(episodeDetail);
    grid.append(episodeCell);
  });

  gridContainer.append(grid);
};
const getEpisodes = (tconst = 'tt0944947') => {
  const url = `https://willp.herokuapp.com/tv-series/${tconst}`;
  fetch(url)
    .then((data) => data.json())
    .then((episodes) => {
      createGrid(episodes);
    });
};

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

class Suggestions {
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
    this.selection = 0;
    updateSuggestions(this.container, this.fuzzyhound, this.input);
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

const createEpisodeDetail$1 = (dataset) => {
  // container
  const episodeDetail = document.createElement('div');
  episodeDetail.className = 'episode-detail';

  // Season and Episode
  const seasonEpisode = document.createElement('div');
  seasonEpisode.textContent = `S${dataset.season} E${dataset.episode}`;
  seasonEpisode.className = 'episode-detail-season-episode';

  // Title and Year
  const titleYear = document.createElement('div');
  titleYear.textContent = `${dataset.title} (${dataset.year})`;
  titleYear.className = 'episode-detail-title-year';

  // Rating and Votes
  const ratingVotes = document.createElement('div');
  ratingVotes.textContent = `${dataset.rating}/10 (${dataset.votes} votes)`;
  ratingVotes.className = 'episode-detail-rating-votes';

  // appends
  episodeDetail.append(seasonEpisode);
  episodeDetail.append(titleYear);
  episodeDetail.append(ratingVotes);

  return episodeDetail;
};

const registerFocus = (suggestions) => {
  suggestions.input.addEventListener('focusin', () => {
    suggestions.input.select();
  });
};

const registerInput = (suggestions) => {
  suggestions.input.addEventListener('input', (event) => {
    const { value } = event.target;
    suggestions.update(value);
  });
};

const registerKeyDown = (suggestions, submit) => {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      submit();
    }
    if (event.code === 'ArrowUp') {
      suggestions.updateSelection(-1);
    }
    if (event.code === 'ArrowDown') {
      suggestions.updateSelection(1);
    }
  });
};

const registerClickContainer = (container, submit) => {
  container.addEventListener('click', () => {
    submit();
  });
};

const registerClickGrid = () => {
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('click', (event) => {
    const url = 'https://www.imdb.com/title/';
    const parentOne = event.target.parentElement;
    const parentTwo = parentOne.parentElement;
    if (event.target.classList.contains('episode-cell')) {
      window.open(`${url}${event.target.getAttribute('data-tconst')}`, '_blank');
    } else if (parentOne.classList.contains('episode-cell')) {
      window.open(`${url}${parentOne.getAttribute('data-tconst')}`, '_blank');
    } else if (parentTwo.classList.contains('episode-cell')) {
      window.open(`${url}${parentTwo.getAttribute('data-tconst')}`, '_blank');
    }
  });
};

const registerHoverContainer = (container, suggestions) => {
  container.addEventListener('mouseover', (event) => {
    let { target } = event;
    if (target === event.currentTarget) return;
    while (!target.classList.contains('result-container') && target) {
      target = target.parentElement;
    }
    let i = 0;
    let { previousSibling } = target;
    while (previousSibling !== null) {
      i += 1;
      previousSibling = previousSibling.previousSibling;
    }
    suggestions.updateSelection(null, i + 1);
  });
};

const registerHoverGrid = () => {
  // tooltip should be centered, just above target div
  // if touching edge of screen, flip to other edge.
  const episodeInfo = document.querySelector('#episode-info');
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.addEventListener('mouseover', (event) => {
    if (!event.target.classList.contains('episode-cell')) return;
    const w = event.target.offsetWidth;
    const l = event.target.offsetLeft;

    const h = event.target.offsetHeight;
    const t = event.target.offsetTop;

    const x = l + w / 2;
    const y = t - episodeInfo.offsetHeight;

    episodeInfo.classList.add('fixed-block');
    episodeInfo.style.top = `${y}px`;
    episodeInfo.style.left = `${x}px`;

    episodeInfo.innerHTML = '';
    episodeInfo.append(createEpisodeDetail$1(event.target.dataset));

    // episodeInfo.textContent = event.target.getAttribute('data-title');
  });
  // the xy coordinates reset to some position when non-mouseover, seems ok
  gridContainer.addEventListener('mouseleave', () => {
    episodeInfo.classList.remove('fixed-block');
  });
};

const suggestions = new Suggestions(
  document.querySelector('#search-input'),
  document.querySelector('.search-suggestions'),
);

registerClickGrid();
registerFocus(suggestions);
registerInput(suggestions);
registerKeyDown(suggestions, () => suggestions.submit());
registerClickContainer(suggestions.container, () => suggestions.submit());
registerHoverContainer(suggestions.container, suggestions);
registerHoverGrid();
