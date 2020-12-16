import { getColor } from './tvSeries.color';

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

export { getEpisodes };
