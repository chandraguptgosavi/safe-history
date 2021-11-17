import { Keyword } from "./models";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("keywords", (items: { [key: string]: any }) => {
    if (typeof items.keywords === "undefined") {
      chrome.storage.sync.set({ keywords: [] });
    }
  });
  chrome.storage.sync.set({ switchOn: true });
});

chrome.history.onVisited.addListener(
  async (result: chrome.history.HistoryItem) => {
    chrome.storage.sync.get("switchOn", (items: { [key: string]: any }) => {
      if (result.url && items.switchOn) {
        chrome.storage.sync.get("keywords", (items: { [key: string]: any }) => {
          const keywords: Keyword[] = items.keywords;
          if (typeof keywords !== "undefined") {
            for (let keyword of keywords) {
              if (
                typeof result.url !== "undefined" &&
                result.url.toLocaleLowerCase().includes(keyword.data)
              ) {
                chrome.history.deleteUrl({ url: result.url });
                break;
              }
            }
          }
        });
      }
    });
  }
);
