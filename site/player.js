(() => {
  const id = new URLSearchParams(location.search).get('game');
  const game = window.GAME_CATALOG[id];
  const byId = id => document.getElementById(id);
  if (!game) { byId('cover').style.display = 'none'; byId('missing').style.display = 'block'; return; }
  document.title = game.title + ' · 游戏试玩库';
  byId('title').textContent = game.title;
  byId('name').textContent = game.title;
  byId('genre').textContent = game.english + ' / ' + game.genre;
  byId('description').textContent = game.description;
  byId('poster').src = game.image;
  byId('download').textContent = '首次加载约 ' + game.megabytes + ' MB · ' + game.version;
  byId('controls').textContent = game.controls;
  let iframe;
  byId('load').addEventListener('click', () => {
    if (iframe) return;
    iframe = document.createElement('iframe');
    iframe.title = game.title + '游戏';
    iframe.allow = 'autoplay; fullscreen; gamepad';
    iframe.allowFullscreen = true;
    iframe.src = game.src;
    iframe.addEventListener('load', () => iframe.contentWindow.focus());
    byId('cover').remove();
    byId('play').appendChild(iframe);
    byId('status').textContent = '正在下载并启动游戏，首次加载请稍候…';
    byId('fullscreen').disabled = false;
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== iframe?.contentWindow) return;
    if (event.data?.type === 'game-ready' && event.data.game === id) {
      byId('status').textContent = game.hint;
      iframe.contentWindow.focus();
    }
  });
  byId('fullscreen').addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await byId('play').requestFullscreen();
      else await document.exitFullscreen();
      iframe?.contentWindow.focus();
    } catch {
      byId('status').textContent = '可使用浏览器菜单进入全屏。' + game.hint;
    }
  });
})();