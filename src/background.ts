import { Keyword } from "./models";

let keywords: Keyword[] = [];
let switchOn: Boolean = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ "switchOn": true });
});

chrome.storage.sync.get("keywords").then((data) => (keywords = data.keywords));
chrome.storage.sync.get("switchOn").then((data) => switchOn = data.switchOn);

chrome.storage.onChanged.addListener(
  (changes: any, areaName: string) => {
    if (areaName === "sync") {
      if (typeof changes.keywords !== "undefined") {
        keywords = changes.keywords.newValue;
      }
      if (typeof changes.switchOn !== "undefined") {
        switchOn = changes.switchOn.newValue;
      }
    }
  }
);

chrome.history.onVisited.addListener((result: chrome.history.HistoryItem) => {
  if (result.url && switchOn) {
    for (let keyword of keywords) {
      if (result.url!.includes(keyword.data)) {
        chrome.history.deleteUrl({ url: result.url! });
        break;
      }
    }
  }
});
