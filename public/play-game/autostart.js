// Hide the internal start screen while the game module loads an embedded match.
if (new URLSearchParams(location.search).get('autostart') === '1') {
  document.documentElement.classList.add('autostart');
}
