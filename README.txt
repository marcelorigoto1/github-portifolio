E-Portfolio of Marcelo Alves Rigoto
https://marcelorigoto1.github.io/github-portifolio/

Static site hosted on GitHub Pages (plain HTML/CSS/JS, no build step).

Structure:
- index.html          Home (globe.gl hero + featured projects)
- about-me.html       Profile, tools & skills, academic and professional timeline
- all-projects.html   Project gallery with category filter
- internship.html     Geotrilho topography & survey internship
- bip.html, issonvis.html   Programme / summer school reports
- thesis/             Master thesis mini-site (overview, methodology, results, downloads)
- assets/css/base.css Shared navbar, footer and body styles (loaded on every page)
- assets/fonts/       Self-hosted Inter (SIL OFL 1.1), preloaded by every page

Adding a page: copy the navbar/footer and <head> meta tags (including the
<script id="theme-init"> line) from an existing page and mark the current link
with class="active" aria-current="page".

Light/dark theme: colours are CSS variables defined at the top of base.css.
Use var(--accent), var(--text), var(--surface)... instead of hex colours so new
styles work in both themes. The topographic background is assets/contours.svg.

To do:
- Add more projects.
- Replace the GitHub preview cards (Prague Transit 3D, MeinSalzburg, Falatorio) with real screenshots.
