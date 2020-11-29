// ---
// ---

(function () {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            const query = event.target.value.toLowerCase();
            getRhymes(query)

        }
    })

    const getRhymes = query => {
        const movieListUrl = '/movies.json'
        const rhymeUrl = `https://rhymebrain.com/talk?function=getRhymes&word=${query}&next=&function=getWordInfo&word=${query}`;
        const minScore = 265;
        const minFreq = 20;
        const minLength = 4;
        Promise.all([
            fetch(rhymeUrl),
            fetch(movieListUrl)
        ]).then(responses => {
            return Promise.all(responses.map(function (response) {
                return response.json();
            }))
        }).then(data => {
            const rhymeBlacklist = ['part'];
            const rhymes = data[0][0].filter(rhyme => {
                return (rhyme.score >= minScore
                    && rhyme.freq >= minFreq
                    && rhyme.word.length >= minLength
                    && !rhymeBlacklist.includes(rhyme.word.toLowerCase()));
            });
            const syllables = parseInt(data[0][1].syllables);
            const sortedRhymes = rhymes.sort((a, b) => {
                if (a.syllables == syllables && b.syllables == syllables) {
                    // if both rhymes have same number of syllables as query, sort by length desc
                    if (a.word.length > b.word.length) {
                        return -1
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
                        return -1
                    } else if (a.word.length < b.word.length) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return a.syllables - b.syllables
                }

            });
            console.log(syllables);
            console.log(sortedRhymes);
            const movies = data[1]
            const matchingMovies = [];
            movies.forEach(movie => {
                const lower = movie.title.toLowerCase();
                if (lower.includes(query)) return;
                let rhymeFound = false;
                sortedRhymes.forEach(rhyme => {
                    if (lower.includes(rhyme.word) && !rhymeFound) {
                        const editedTitle = lower.replace(rhyme.word, query)
                            .split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                            .join(' ');
                        matchingMovies.push({
                            title: movie.title,
                            editedTitle,
                            votes: movie.votes
                        });
                        rhymeFound = true;
                    }
                });
            });
            const sortedMovies = matchingMovies.sort((a, b) => b.votes > a.votes);
            const searchResults = document.querySelector('.search-results');
            searchResults.addEventListener('click', function (event) {
                if (event.target.className === 'movie-container') {
                    event.target.classList.toggle('favorite');
                }
                else if (event.target.className === 'movie-edited-title') {
                    event.target.parentElement.classList.toggle('favorite');
                }
            })
            searchResults.innerHTML = '';
            const noResults = document.querySelectorAll('.movie-no-results');
            Array.from(noResults).forEach((div) => div.remove());
            if (!sortedMovies.length) {
                const body = document.querySelector('body');
                const noResults = document.createElement('div');
                noResults.className = 'movie-no-results';
                noResults.textContent = 'No Results :(';
                body.append(noResults);
            } else {
                const frag = document.createDocumentFragment();
                sortedMovies.forEach(movie => {
                    const movieContainer = document.createElement('div');
                    movieContainer.className = 'movie-container';
                    const editedTitle = document.createElement('div');
                    editedTitle.className = 'movie-edited-title';
                    editedTitle.textContent = movie.editedTitle;
                    movieContainer.append(editedTitle);
                    frag.appendChild(movieContainer);
                })
                searchResults.appendChild(frag.cloneNode(true))
            }
        })

    }


})();