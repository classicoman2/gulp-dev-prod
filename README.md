# gulp-dev-prod

Empram Gulp 4 per a:
1. Establir un entorn de desenvolupament amb Compilador Sass/SCSS amb Theming Bootstrap i Live Server per visualitzar canvis instantàniament
2. Generar versió de producció

## 1. Entorn de Desenvolupament

1. Sass/SCSS converter with **gulp-sass** package
2. Live Server that reloades on changes in the *.html, *scss or *.js files using **browsersync**
3. Bootstrap 4 with Theming easily integrated (change predefined vars., themes & load only the scss files you need). Needs:

### Usage
```bash
npm run watch
```

## 2. Generar versió producció
- 1: Crea un directori `dist`. Si ja existeix, borra el seu contingut. 
- 2: Crea una versió optimitzada de HTML a dins de `dist` amb [htmlmin](https://www.npmjs.com/package/gulp-htmlmin)
- 3: Crea un sol fitxer _bundle_ de codi javascript a dins de `dist/js` amb [browserify](https://www.npmjs.com/package/browserify)
- 4: Minifica el codi CSS de `src/css` a dins de `dist/css` amb [postcss](https://www.npmjs.com/package/postcss)
- 5: Minimitza les imatges de `src/images` amb el package [imagemin](https://web.dev/use-imagemin-to-compress-images/) i les guarda a dins de `dist/images`

> Alerta amb els subdirectoris dels fitxers, si no estan ben indicats, fallarà l'execució de `Gulp`

## Com emprar-ho en el meu projecte? 

-  Copia el fitxer `gulpfile.js` a directori arrel
- Crea `package.json` al teu projecte i afegeix les `dependencies` i les `devDependencies` al `package.json`
- Executa:

 ```bash
 npm i 
 ```

### Crear versió de producció
```bash
npm run build
```
 
## Webgraphy

- [Setting up Gulp 4 for Bootstrap, SASS, and BrowserSync](https://medium.com/swlh/setting-up-gulp-4-0-2-for-bootstrap-sass-and-browsersync-7917f5f5d2c5) - I had to change the routes for the .html and .js watch task
- [Gulp for Beginners (CSS-Tricks)](https://css-tricks.com/gulp-for-beginners) - Good intro to Gulp but **Watch!!** it's outdated, version <4.0.0
- [Bootstrap theming tutorial](https://getbootstrap.com/docs/4.1/getting-started/theming/)

- [Transpile and minify Javascript, HTML and CSS using Gulp 4](https://goede.site/transpile-and-minify-javascript-html-and-css-using-gulp-4)
- [Getting Started with Browserify](https://scotch.io/tutorials/getting-started-with-browserify#toc-setting-up-with-gulp) - Integrate **Browserify** with **Gulp** 