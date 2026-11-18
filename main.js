const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { pathToFileURL } = require('url');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const REMOTE = 'https://raw.githubusercontent.com/Marius-Guignard/Cubix/main/index.html';
function cacheFile() { return path.join(app.getPath('userData'), 'cubix-online.html'); }
function fetchText(url, ms) {
  return new Promise((resolve) => {
    let done = false;
    const end = (v) => { if (!done) { done = true; resolve(v); } };
    try {
      const req = https.get(url + '?t=' + Date.now(), { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
        if (res.statusCode !== 200) { res.resume(); return end(null); }
        let d = ''; res.setEncoding('utf8');
        res.on('data', (c) => d += c);
        res.on('end', () => end(d));
      });
      req.on('error', () => end(null));
      req.setTimeout(ms, () => { req.destroy(); end(null); });
    } catch (e) { end(null); }
  });
}
async function updateGame() {
  const t = await fetchText(REMOTE, 4000);
  if (t && t.length > 100000 && t.indexOf('</html>') > 0 && t.indexOf('THREE') > 0) {
    const local = t.split(CDN).join(pathToFileURL(path.join(__dirname, 'three.min.js')).href);
    try { fs.writeFileSync(cacheFile(), local); } catch (e) {}
  }
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 800, minHeight: 500,
    title: 'Cubix', backgroundColor: '#0b1020', autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  Menu.setApplicationMenu(null);
  let f = path.join(__dirname, 'index.html');
  try { if (fs.existsSync(cacheFile())) f = cacheFile(); } catch (e) {}
  win.loadFile(f);
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.key === 'F12' && input.control) { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
}
app.whenReady().then(async () => {
  await updateGame();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { app.quit(); });
