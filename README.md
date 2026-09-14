# Gravity Shift

Gravity Shift is a mobile-friendly 2D puzzle platformer built with HTML, CSS, JavaScript, and the HTML5 Canvas API. Players traverse neon laboratory test chambers by flipping gravity between the floor and ceiling, collecting energy crystals, and reaching the exit door.

[![Play on GitHub Pages](https://img.shields.io/badge/Play-Gravity%20Shift-1d9bff?style=for-the-badge&logo=github)](https://gituserc1140.github.io/Gravity_Shift_Game_App/)

## Features

- 10 playable levels with increasing difficulty
- Gravity flip mechanic for floor and ceiling traversal
- Touch-friendly mobile controls plus desktop keyboard controls
- Hazards including spikes, falling blocks, and laser barriers
- Moving platforms, gravity zones, gravity portals, and locked exits
- Crystal collection and sequential level unlocking
- Progress saved locally with `localStorage`
- Static `/docs` deployment structure for GitHub Pages

## Controls

### Desktop

- `A` / `D` or arrow keys: move left / right
- `Space`: jump
- `Shift` or `G`: flip gravity
- `Escape` or the on-screen Pause button: pause

### Mobile

Use the on-screen buttons for left, right, jump, and gravity flip.

## Project Structure

```text
/docs
  index.html
  style.css
  game.js
  player.js
  levels.js
  physics.js
  ui.js
README.md
```

## Local Development

Because the game is fully static, you can open `/docs/index.html` directly in a browser or serve the repository with any simple static file server.

Example with Python:

```bash
cd Gravity_Shift_Game_App
python -m http.server 8000
```

Then open `http://localhost:8000/docs/`.

## GitHub Pages Deployment

If GitHub Pages is publishing the repository root, the root `index.html` now redirects visitors into `/docs/` so the game loads instead of the default repository information page.

If you prefer branch-based Pages settings, you can still configure GitHub Pages to serve directly from the repository's `/docs` directory on your default branch.
