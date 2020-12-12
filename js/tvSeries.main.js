'use strict';

class Heatmap {
    constructor(series_url) {
      this.series_url = series_url;
      this.div = document.getElementById('plotlyDiv');
      this.fetchData(this.series_url);
    }
  
    addListeners() {
      if (window.innerWidth <= 600) {
        return;
      }
      var plot_element = this.div;
      plot_element.on('plotly_click', function (data) {
        {
          console.log(data);
          var point = data.points[0];
          if (point) {
            {
              var customData = point.customdata;
              if (customData) {
                {
                  window.open(`https://www.imdb.com/title/${point.customdata}`);
                }
              }
            }
          }
        }
      });
      var dragLayer = document.getElementsByClassName('nsewdrag')[0];
      plot_element.on('plotly_hover', data => {
        dragLayer.style.cursor = 'pointer';
      });
  
      plot_element.on('plotly_unhover', data => {
        dragLayer.style.cursor = '';
      });
    }
  
    fetchData(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => this.processData(data))
        .then(data => this.buildHeatmap(data))
        .then(() => this.addListeners())
        .catch(err => console.log(err));
    }
  
    createEmptyTwoDimArray(size, fill = null) {
      var twoDimArray = (new Array(size[0])
        .fill(fill)
        .map(() => new Array(size[1])
          .fill(fill)));
      return twoDimArray
    }
  
    transpose(matrix) {
      return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }
  
    size(matrix) {
      var row_count = matrix.length;
      var row_sizes = [];
      for (var i = 0; i < row_count; i++) {
        if (!matrix[i]) {
          row_sizes.push(0);
        } else {
          row_sizes.push(matrix[i].length);
        }
      }
      return [row_count, Math.max.apply(null, row_sizes)]
    }
  
    merge(matrix_src, matrix_targ) {
      matrix_src.forEach((row, index) => {
        row.forEach((value, r_index) => {
          matrix_targ[index][r_index] = value;
        });
      });
      return matrix_targ
    }
  
    groupBy(items, key) {
      return items.reduce(
        (result, item) => ({
          ...result,
          [item[key]]: [
            ...(result[item[key]] || []),
            item,
          ],
        }),
        {},
      )
    };
  
    extractProperty(data, property) {
      return data.map(r => r.map(i => i[property]))
    }
  
    processData(data) {
  
      data = data.filter(e => e.season_number && e.episode_number);
  
      var seasons = this.groupBy(data, 'season_number');
      seasons = Object.values(seasons).map(season => {
        return season.sort((a, b) => a.episode_number - b.episode_number)
      });
  
      const max_length = Math.max(...seasons.map(s => s.length));
      if (max_length > 32) {
        console.log('More than 32 episodes per season, grouping by year...');
  
        var years = this.groupBy(data, 'start_year');
        years = Object.values(years).map(year => {
          return year.sort((a, b) => a.episode_number - b.episode_number)
        });
        const ratings = this.extractProperty(years, 'average_rating');
        const titles = this.extractProperty(years, 'primary_title');
        const tconsts = this.extractProperty(years, 'tconst');
  
        data = {
          ratings: this.transpose(ratings),
          titles: this.transpose(titles, ''),
          tconsts: this.transpose(tconsts, '')
        };
        return data
      } else {
        const ratings = this.extractProperty(seasons, 'average_rating');
        const titles = this.extractProperty(seasons, 'primary_title');
        const tconsts = this.extractProperty(seasons, 'tconst');
        data = {
          ratings: this.transpose(ratings),
          titles: this.transpose(titles, ''),
          tconsts: this.transpose(tconsts, '')
        };
        return data
      }
    }
  
  
  
    buildHeatmap(data) {
      const size = this.size(data.ratings);
      const xValues = [...Array(size[1]).keys()].map(x => ++x);
      const yValues = [...Array(size[0]).keys()].map(x => ++x);
      const zValues = data.ratings;
  
      const colorscaleValue = [
        [0.00, '#EEEEEE'],
        [0.01, '#D2222D'],
        [0.40, '#D2222D'],
        [0.65, '#FFBF00'],
        [1.00, '#238823'],
      ];
  
      const small_screen = window.innerWidth <= 600;
  
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
            side: 'right'
          },
          ypad: 0
        },
        showscale: !small_screen,
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
            size: small_screen ? 18 : 28,
          }
        },
        annotations: [],
        xaxis: {
          showgrid: false,
          title: {
            text: 'Season'
          },
          side: 'bottom',
          tickmode: 'linear',
          automargin: true,
        },
        yaxis: {
          showgrid: false,
          title: {
            text: 'Episode'
          },
          tickmode: 'linear',
          automargin: true,
        },
        margin: {
          l: small_screen ? 0 : 50,
          r: small_screen ? 0 : 50,
          t: small_screen ? 30 : 50,
          b: small_screen ? 0 : 50,
          pad: 0,
          autoexpand: true,
        },
        dragmode: !small_screen,
      };
  
      for (var i = 0; i < yValues.length; i++) {
        for (var j = 0; j < xValues.length; j++) {
          var currentValue = zValues[i][j];
          var textColor = 'white';
          var result = {
            xref: 'x1',
            yref: 'y1',
            x: xValues[j],
            y: yValues[i],
            text: currentValue ? currentValue : 'NA',
            font: {
              family: 'Arial',
              size: 12,
              color: 'rgb(50, 171, 96)'
            },
            showarrow: false,
            font: {
              color: textColor
            }
          };
          layout.annotations.push(result);
        }
      }
  
      const config = {
        responsive: true,
        displayModeBar: !small_screen,
        autosizable: true,
      };
      Plotly.newPlot(this.div, plotlyData, layout, config);
    }
  }

const fuzzyhound = new FuzzySearch({ output_limit: 6, output_map: "alias" });


// - - - - - - - - - - - - - - - - - - - - - - -
//    Item template
// - - - - - - - - - - - - - - - - - - - - - - -

function itemTemplate(suggestion) {

  return [
    "<div>",
    "<span class='title'>\"", fuzzyhound.highlight(suggestion.title, "title"), "\"</span>",
    "<span class='author'>", (suggestion.author) ? " by " + fuzzyhound.highlight(suggestion.author, "author") : "", "</span>",
    "<span class='score' title='", suggestion._match, "'>(&nbsp;", suggestion._score.toFixed(2), "&nbsp;)</span>",
    "</div>"
  ].join("");

}

//
// Use footer to show some performance stats
//

function footerTemplate() {
  var render_end = Date.now();
  return "<div class='typeahead-footer'> " +
    "Search took <strong>" + fuzzyhound.search_time.toFixed(3) + " ms</strong><br>" +
    "Total (search+highlight+render):  <strong>" + (render_end - fuzzyhound.start_time).toFixed(3) + " ms</strong><br>" +
    "Query: <strong>" + fuzzyhound.query.normalized.length + "</strong> chars <br>" +
    "Source contain " + fuzzyhound.source.length + " Items<br>" +
    "</div>";
}

//- - - - - - - - - - -
//   Typeahead Setup
// - - - - - - - - - - -

$('#demo-query').typeahead({
  minLength: 2,
  highlight: false //we'll use FuzzySearch highlight instead
},
  {
    name: 'books',
    limit: 100, // let fuzzyhound.output_limit apply limit
    source: fuzzyhound,
    display: "title",
    templates: {
      suggestion: itemTemplate,
      footer: footerTemplate,
      pending: ""
    }

  }).bind('typeahead:select', function (ev, suggestion) {
    document.activeElement.blur();
    handleSubmit(suggestion);
  });

fetch('https://raw.githubusercontent.com/wpowers42/wpowers42.github.io/main/json/series.json')
  .then(res => res.json())
  .then(data => {
    fuzzyhound.setOptions({
      source: data,
      keys: { title: 'title' }
    });
  });

// - - - - - - - - - - - -
//   Setup onsubmit handlers
//- - - - - - - - - - - - -

function handleSubmit(suggestion) {

  var tconst = suggestion._item.tconst;
  const url = `https://willp.herokuapp.com/tv-series/${tconst.toString()}`;
  var hm = new Heatmap(url);

}
