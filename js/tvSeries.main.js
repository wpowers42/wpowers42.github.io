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

const createGrid = (data) => {
  const gridContainer = document.querySelector('#heatmap-grid-container');
  gridContainer.innerHTML = '';

  const grid = document.createElement('div');
  const columns = Math.max(...data.map((o) => o.season_number));
  const rows = Math.max(...data.map((o) => o.episode_number));

  const gridCss = {
    width: '90%',
    height: '70vh',
    display: 'grid',
    'grid-template-columns': `repeat(${columns}, ${100 / columns}%)`,
    'grid-template-rows': `repeat(${rows}, ${100 / rows}%)`,
    margin: 'auto',
  };
  Object.keys(gridCss).forEach((style) => {
    grid.style[style] = gridCss[style];
  });

  data.forEach((episode) => {
    const episodeCell = document.createElement('div');
    episodeCell.className = 'episode-cell';
    episodeCell.setAttribute('data-tconst', episode.tconst);
    const episodeDetail = createEpisodeDetail(episode);
    const tooltipPosition = episode.season_number / columns > 0.50 ? 'left' : 'right';
    episodeDetail.classList.add(`tooltip-${tooltipPosition}`);
    const rgb = getColor(episode.average_rating);
    const episodeCss = {
      'grid-column': episode.season_number,
      'grid-row': -episode.episode_number + rows + 1,
      'background-color': `rgb(${rgb.r},${rgb.g},${rgb.b})`,
    };
    Object.keys(episodeCss).forEach((style) => {
      episodeCell.style[style] = episodeCss[style];
    });
    episodeCell.append(episodeDetail);
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

/* eslint-disable no-underscore-dangle */

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
    submitSelection();
  }
});
window.addEventListener('keydown', (event) => highlightSuggestion(event));

suggestions.addEventListener('click', (event) => {
  submitSelection();
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
