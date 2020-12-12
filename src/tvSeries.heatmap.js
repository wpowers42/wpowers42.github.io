export default class Heatmap {
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
      .then((data) => this.processData(data))
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

  processData(dataArg) {
    const data = dataArg.filter((e) => e.season_number && e.episode_number);

    let seasons = this.groupBy(data, 'season_number');
    // eslint-disable-next-line max-len
    seasons = Object.values(seasons).map((season) => season.sort((a, b) => a.episode_number - b.episode_number));

    const maxLength = Math.max(...seasons.map((s) => s.length));
    if (maxLength > 32) {
      // eslint-disable-next-line no-console
      console.warn('More than 32 episodes per season, grouping by year...');

      let years = this.groupBy(data, 'start_year');
      // eslint-disable-next-line max-len
      years = Object.values(years).map((year) => year.sort((a, b) => a.episode_number - b.episode_number));
      const ratings = this.extractProperty(years, 'average_rating');
      const titles = this.extractProperty(years, 'primary_title');
      const tconsts = this.extractProperty(years, 'tconst');

      return {
        ratings: this.transpose(ratings),
        titles: this.transpose(titles, ''),
        tconsts: this.transpose(tconsts, ''),
      };
    }
    const ratings = this.extractProperty(seasons, 'average_rating');
    const titles = this.extractProperty(seasons, 'primary_title');
    const tconsts = this.extractProperty(seasons, 'tconst');
    return {
      ratings: this.transpose(ratings),
      titles: this.transpose(titles, ''),
      tconsts: this.transpose(tconsts, ''),
    };
  }

  buildHeatmap(data) {
    const size = this.size(data.ratings);
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
