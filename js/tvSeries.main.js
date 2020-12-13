'use strict';

class Heatmap {
  constructor(seriesUrl) {
    this.seriesUrl = seriesUrl;
    this.div = document.getElementById('plotlyDiv');
    this.fetchData(this.seriesUrl);
  }

  addListeners() {
    if (window.innerWidth <= 600) {
      return;
    }
    const plotElement = this.div;
    plotElement.on('plotly_click', (data) => {
      const point = data.points[0];
      if (point) {
        const customData = point.customdata;
        if (customData) {
          window.open(`https://www.imdb.com/title/${point.customdata}`);
        }
      }
    });
    const dragLayer = document.getElementsByClassName('nsewdrag')[0];
    plotElement.on('plotly_hover', () => {
      dragLayer.style.cursor = 'pointer';
    });

    plotElement.on('plotly_unhover', () => {
      dragLayer.style.cursor = '';
    });
  }

  fetchData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => Heatmap.processData(data))
      .then((data) => this.buildHeatmap(data))
      .then(() => this.addListeners())
      .catch((err) => console.error(err));
  }

  static createEmptyTwoDimArray(size, fill = null) {
    const twoDimArray = (new Array(size[0])
      .fill(fill)
      .map(() => new Array(size[1])
        .fill(fill)));
    return twoDimArray;
  }

  static transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }

  static size(matrix) {
    const rowCount = matrix.length;
    const rowSizes = [];
    for (let i = 0; i < rowCount; i++) {
      if (!matrix[i]) {
        rowSizes.push(0);
      } else {
        rowSizes.push(matrix[i].length);
      }
    }
    return [rowCount, Math.max.apply(null, rowSizes)];
  }

  static merge(matrixSrc, matrixTarg) {
    matrixSrc.forEach((row, index) => {
      row.forEach((value, rIndex) => {
        // eslint-disable-next-line no-param-reassign
        matrixTarg[index][rIndex] = value;
      });
    });
    return matrixTarg;
  }

  static groupBy(items, key) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );
  }

  static extractProperty(data, property) {
    return data.map((r) => r.map((i) => i[property]));
  }

  static processData(dataArg) {
    const data = dataArg.filter((e) => e.season_number && e.episode_number);

    let seasons = Heatmap.groupBy(data, 'season_number');
    // eslint-disable-next-line max-len
    seasons = Object.values(seasons).map((season) => season.sort((a, b) => a.episode_number - b.episode_number));

    const maxLength = Math.max(...seasons.map((s) => s.length));
    if (maxLength > 32) {
      // eslint-disable-next-line no-console
      console.warn('More than 32 episodes per season, grouping by year...');

      let years = Heatmap.groupBy(data, 'start_year');
      // eslint-disable-next-line max-len
      years = Object.values(years).map((year) => year.sort((a, b) => a.episode_number - b.episode_number));
      const ratings = Heatmap.extractProperty(years, 'average_rating');
      const titles = Heatmap.extractProperty(years, 'primary_title');
      const tconsts = Heatmap.extractProperty(years, 'tconst');

      return {
        ratings: Heatmap.transpose(ratings),
        titles: Heatmap.transpose(titles, ''),
        tconsts: Heatmap.transpose(tconsts, ''),
      };
    }
    const ratings = Heatmap.extractProperty(seasons, 'average_rating');
    const titles = Heatmap.extractProperty(seasons, 'primary_title');
    const tconsts = Heatmap.extractProperty(seasons, 'tconst');
    return {
      ratings: Heatmap.transpose(ratings),
      titles: Heatmap.transpose(titles, ''),
      tconsts: Heatmap.transpose(tconsts, ''),
    };
  }

  buildHeatmap(data) {
    const size = Heatmap.size(data.ratings);
    const xValues = [...Array(size[1]).keys()].map((x) => ++x);
    const yValues = [...Array(size[0]).keys()].map((x) => ++x);
    const zValues = data.ratings;

    const colorscaleValue = [
      [0.00, '#EEEEEE'],
      [0.01, '#D2222D'],
      [0.40, '#D2222D'],
      [0.65, '#FFBF00'],
      [1.00, '#238823'],
    ];

    const smallScreen = window.innerWidth <= 600;

    const plotlyData = [{
      x: xValues,
      y: yValues,
      z: zValues,
      customdata: data.tconsts,
      text: data.titles,
      hovertemplate: (`
          <b>Season %{x}, Episode %{y}</b><br>
          <b>Title:</b> %{text}<br>
          <b>Rating:</b> %{z}<extra></extra>`),
      hoverongaps: false,
      type: 'heatmap',
      colorbar: {
        thickness: 30,
        title: {
          text: 'Rating',
          side: 'right',
        },
        ypad: 0,
      },
      showscale: !smallScreen,
      colorscale: colorscaleValue,
      opacity: 0.90,
      zmin: 1,
      zmax: 10,
      xgap: 2,
      ygap: 2,
    }];

    const layout = {
      title: {
        text: 'Episode Ratings',
        font: {
          size: smallScreen ? 18 : 28,
        },
      },
      annotations: [],
      xaxis: {
        showgrid: false,
        title: {
          text: 'Season',
        },
        side: 'bottom',
        tickmode: 'linear',
        automargin: true,
      },
      yaxis: {
        showgrid: false,
        title: {
          text: 'Episode',
        },
        tickmode: 'linear',
        automargin: true,
      },
      margin: {
        l: smallScreen ? 0 : 50,
        r: smallScreen ? 0 : 50,
        t: smallScreen ? 30 : 50,
        b: smallScreen ? 0 : 50,
        pad: 0,
        autoexpand: true,
      },
      dragmode: !smallScreen,
    };

    for (let i = 0; i < yValues.length; i++) {
      for (let j = 0; j < xValues.length; j++) {
        const currentValue = zValues[i][j];
        const textColor = 'white';
        const result = {
          xref: 'x1',
          yref: 'y1',
          x: xValues[j],
          y: yValues[i],
          text: currentValue || 'NA',
          font: {
            family: 'Arial',
            size: 12,
            color: textColor,
          },
          showarrow: false,
        };
        layout.annotations.push(result);
      }
    }

    const config = {
      responsive: true,
      displayModeBar: !smallScreen,
      autosizable: true,
    };
    // eslint-disable-next-line no-undef
    Plotly.newPlot(this.div, plotlyData, layout, config);
  }
}

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
  const hm = new Heatmap(url);
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
