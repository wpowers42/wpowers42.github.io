const createEpisodeDetail = (dataset) => {
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

export { createEpisodeDetail };
