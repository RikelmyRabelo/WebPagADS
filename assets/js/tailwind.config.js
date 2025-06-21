module.exports = {
  darkMode: 'class', // era pra ser pro modo escuro, mas não consegui fazer funcionar :(
  content: [
    '../../*.html',        // volta duas pastas p encontrar os HTMLs na raiz
    './**/*.js',          // procura os arquivos js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}