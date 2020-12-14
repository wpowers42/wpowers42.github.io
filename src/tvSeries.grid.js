import { getColor } from './tvSeries.color';

// const gridContainer = document.querySelector('#heatmap-grid-container');
// gridContainer.addEventListener('mouseover', (event) => {
//   console.log(event.target.getAttribute('data-primary-title'));
// });

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
    height: '600px',
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

export { getEpisodes };
