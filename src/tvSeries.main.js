import { Heatmap } from './tvSeries.heatmap.js'
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
      keys: { title: 'primary_title' }
    })
  })

// - - - - - - - - - - - -
//   Setup onsubmit handlers
//- - - - - - - - - - - - -

function handleSubmit(suggestion) {

  var tconst = suggestion._item.tconst;
  var url = `https://wpowers.dev/api/imdb/series/${tconst.toString()}/episodes/`
  var hm = new Heatmap(url);

}