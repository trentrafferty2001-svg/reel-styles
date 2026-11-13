// node shoot.js <scene>... → ../<scene>.png (renders through a local http server)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], { cwd: path.join(__dirname, '..'), stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 800));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  try {
    for (const n of process.argv.slice(2)) {
      const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
      p.on('console', (m) => { if (m.type() === 'error') console.log(n, 'console:', m.text()); });
      p.on('pageerror', (e) => console.log(n, 'pageerror:', e.message));
      const t = Date.now();
      await p.goto(`http://127.0.0.1:8765/v2/page.html?s=${n}`);
      await p.waitForFunction(() => window.READY === true, null, { timeout: 300000 });
      await p.waitForTimeout(300);
      await p.screenshot({ path: path.join(__dirname, '..', n + '.png') });
      console.log(n, 'ok', ((Date.now() - t) / 1000).toFixed(1) + 's');
      await p.close();
    }
  } finally { await b.close(); srv.kill(); }
})();
