# loongbong.github.io

Personal portfolio of Loong Bong — AI/technical work across the vibe-coded → rigorously-engineered spectrum.

Live: https://loongbong.github.io

## Stack
Static site for GitHub Pages. Vanilla HTML / CSS / JS, no framework, no build step. The five projects are defined as a data array (`js/data.js`) and rendered through one reusable "journey" template (`js/render.js`). A horizontal spectrum visual doubles as the thesis and the navigation.

```
index.html        single page (head meta + mount points)
css/styles.css    design system + spectrum + journey template + motion
js/data.js        site content + the PROJECTS data array (single source of truth)
js/render.js      spectrum + journey-template + about renderers
js/demos.js       one interactive demo per project
js/main.js        motion: entrance, scroll-reveal, scroll-spy accent-shift, sticky nav
assets/           favicon, social image, headshot, project media
```

## Develop
```
python3 -m http.server 8000   # then open http://localhost:8000
```
