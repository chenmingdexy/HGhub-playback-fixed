import assert from "node:assert/strict";
import { createServer } from "vite";
import { chromium } from "playwright-core";

const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
  for (const mode of ["new", "legacy", "empty"]) {
    const page = await browser.newPage();
    page.on("pageerror", error => console.error("PAGE ERROR:", error.message));
    const mediaRequests = [];
    page.on("request", request => { if (request.url().startsWith("http://hg.localhost/")) mediaRequests.push(request.url()); });
    await page.route("http://hg.localhost/**", route => route.fulfill({ status: 200, body: "", headers: { "Access-Control-Allow-Origin": "*" } }));
    await page.goto(`${server.resolvedUrls.local[0]}tests/playback-api.html?mode=${mode}`);
    if (mode === "empty") {
      await page.getByText("暂无播放地址", { exact: true }).waitFor();
    } else {
      if (await page.getByText("暂无播放地址", { exact: true }).count()) {
        assert.fail(`${mode} response incorrectly rejected as 暂无播放地址`);
      }
      await page.waitForFunction(() => document.querySelector("video")?.getAttribute("src"), undefined, { timeout: 5000 });
      await page.waitForRequest(request => request.url().startsWith("http://hg.localhost/"), { timeout: 5000 }).catch(() => {});
      assert(mediaRequests.includes(`http://hg.localhost/hls?u=${encodeURIComponent(`https://media.fixture.invalid/${mode}.mp4`)}`), "Expected selected stream to reach the media proxy");
    }
    console.log(`PASS: ${mode} playback response`);
    await page.close();
  }
} finally {
  await browser?.close();
  await server.close();
}
