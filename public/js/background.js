var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("keywords", (items) => {
        if (typeof items.keywords === "undefined") {
            chrome.storage.sync.set({ keywords: [] });
        }
    });
    chrome.storage.sync.set({ switchOn: true });
});
chrome.history.onVisited.addListener((result) => __awaiter(void 0, void 0, void 0, function* () {
    chrome.storage.sync.get("switchOn", (items) => {
        if (result.url && items.switchOn) {
            chrome.storage.sync.get("keywords", (items) => {
                const keywords = items.keywords;
                if (typeof keywords !== "undefined") {
                    for (let keyword of keywords) {
                        if (typeof result.url !== "undefined" &&
                            result.url.toLocaleLowerCase().includes(keyword.data)) {
                            chrome.history.deleteUrl({ url: result.url });
                            break;
                        }
                    }
                }
            });
        }
    });
}));
export {};
