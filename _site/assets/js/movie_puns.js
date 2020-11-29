'use strict';

(function () {
    var searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            var query = event.target.value.toLowerCase();
            getRhymes(query);
        }
    });

    var getRhymes = function getRhymes(query) {
        var movieListUrl = '/movies.json';
        var rhymeUrl = 'https://rhymebrain.com/talk?function=getRhymes&word=' + query + '&next=&function=getWordInfo&word=' + query;
        var minScore = 265;
        var minFreq = 20;
        var minLength = 4;
        Promise.all([fetch(rhymeUrl), fetch(movieListUrl)]).then(function (responses) {
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (data) {
            var rhymes = data[0][0].filter(function (rhyme) {
                return rhyme.score >= minScore && rhyme.freq >= minFreq && rhyme.word.length >= minLength;
            });
            var syllables = parseInt(data[0][1].syllables);
            var sortedRhymes = rhymes.sort(function (a, b) {
                if (a.syllables == syllables && b.syllables == syllables) {
                    // if both rhymes have same number of syllables as query, sort by length desc
                    if (a.word.length > b.word.length) {
                        return -1;
                    } else if (a.word.length < b.word.length) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (a.syllables == syllables) {
                    return -1;
                } else if (b.syllables == syllables) {
                    return 1;
                } else if (a.syllables == b.syllables) {
                    // if syllables are the same, sort by length
                    if (a.word.length > b.word.length) {
                        return -1;
                    } else if (a.word.length < b.word.length) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return a.syllables - b.syllables;
                }
            });
            console.log(syllables);
            console.log(sortedRhymes);
            var movies = data[1];
            var matchingMovies = [];
            movies.forEach(function (movie) {
                var lower = movie.title.toLowerCase();
                if (lower.includes(query)) return;
                var rhymeFound = false;
                sortedRhymes.forEach(function (rhyme) {
                    if (lower.includes(rhyme.word) && !rhymeFound) {
                        var editedTitle = lower.replace(rhyme.word, query).split(' ').map(function (w) {
                            return w[0].toUpperCase() + w.substr(1).toLowerCase();
                        }).join(' ');
                        matchingMovies.push({
                            title: movie.title,
                            editedTitle: editedTitle,
                            votes: movie.votes
                        });
                        rhymeFound = true;
                    }
                });
            });
            var sortedMovies = matchingMovies.sort(function (a, b) {
                return b.votes > a.votes;
            });
            var searchResults = document.querySelector('.search-results');
            searchResults.addEventListener('click', function (event) {
                if (event.target.className === 'movie-container') {
                    event.target.classList.toggle('favorite');
                } else if (event.target.className === 'movie-edited-title') {
                    event.target.parentElement.classList.toggle('favorite');
                }
            });
            searchResults.innerHTML = '';
            var noResults = document.querySelectorAll('.movie-no-results');
            Array.from(noResults).forEach(function (div) {
                return div.remove();
            });
            if (!sortedMovies.length) {
                var body = document.querySelector('body');
                var _noResults = document.createElement('div');
                _noResults.className = 'movie-no-results';
                _noResults.textContent = 'No Results :(';
                body.append(_noResults);
            } else {
                (function () {
                    var frag = document.createDocumentFragment();
                    sortedMovies.forEach(function (movie) {
                        var movieContainer = document.createElement('div');
                        movieContainer.className = 'movie-container';
                        var editedTitle = document.createElement('div');
                        editedTitle.className = 'movie-edited-title';
                        editedTitle.textContent = movie.editedTitle;
                        movieContainer.append(editedTitle);
                        frag.appendChild(movieContainer);
                    });
                    searchResults.appendChild(frag.cloneNode(true));
                })();
            }
        });
    };
})();