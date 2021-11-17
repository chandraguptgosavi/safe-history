let keywords = [];
let switchOn = true;
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("keywords", (items) => {
        if (typeof items.keywords === "undefined") {
            chrome.storage.sync.set({ keywords: [] });
        }
    });
    chrome.storage.sync.set({ switchOn: true });
});
chrome.storage.sync.get("keywords", (items) => {
    if (typeof items.keywords !== "undefined") {
        keywords = items.keywords;
    }
});
chrome.storage.sync.get("switchOn", (items) => {
    if (typeof items.keywords !== "undefined") {
        switchOn = items.switchOn;
    }
});
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync") {
        if (typeof changes.keywords !== "undefined") {
            keywords = changes.keywords.newValue;
        }
        if (typeof changes.switchOn !== "undefined") {
            switchOn = changes.switchOn.newValue;
        }
    }
});
chrome.history.onVisited.addListener((result) => {
    setTimeout(() => {
        if (result.url && switchOn) {
            for (let keyword of keywords) {
                if (result.url.toLocaleLowerCase().includes(keyword.data)) {
                    chrome.history.deleteUrl({ url: result.url });
                    break;
                }
            }
        }
    }, 0);
});
export {};
