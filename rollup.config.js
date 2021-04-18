import babel from '@rollup/plugin-babel';

export default [{
  input: 'src/age.main.js',
  output: {
    file: 'js/age.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/clock.main.js',
  output: {
    file: 'js/clock.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/movies.main.js',
  output: {
    file: 'js/movies.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/tvSeries.main.js',
  output: {
    file: 'js/tvSeries.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/interval.main.js',
  output: {
    file: 'js/interval.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/secret.main.js',
  output: {
    file: 'js/secret.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}, {
  input: 'src/anagrams.main.js',
  output: {
    file: 'js/anagrams.main.js',
    format: 'cjs',
  },
  plugins: [babel({ babelHelpers: 'bundled' })],
}];
