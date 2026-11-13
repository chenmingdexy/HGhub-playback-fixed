import React from "react";
import { createRoot } from "react-dom/client";
import Feed from "../src/components/Feed";
import { AppProvider } from "../src/store";
import "../src/index.css";

const mode = new URLSearchParams(location.search).get("mode");
Object.assign(window, { __TAURI_INTERNALS__: { invoke(cmd: string) {
  if (cmd === "api_play") return Promise.resolve(mode === "new"
    ? { video_url: "", streams: { main: "https://media.fixture.invalid/new.mp4" } }
    : mode === "legacy" ? { video_url: "https://media.fixture.invalid/legacy.mp4" }
    : { video_url: "", streams: {} });
  if (cmd === "api_video") return Promise.resolve({ id: 117, title: "Playback fixture", tags: [], episodes: [], episode_count: 1 });
  if (cmd === "app_boot") return Promise.resolve({ user: null, logged_in: false });
  return Promise.resolve(null);
} } });
createRoot(document.querySelector("#root")!).render(<AppProvider>
  <Feed videoIds={[117]} mode="home" active bottomInset={0} />
</AppProvider>);
