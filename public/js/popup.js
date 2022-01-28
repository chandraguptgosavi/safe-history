var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function App() {
    return __awaiter(this, void 0, void 0, function* () {
        const keywordsListEl = document.querySelector(".Keywords");
        const bodyEl = document.getElementsByTagName("body")[0];
        const fab = document.querySelector(".FAB");
        const addIconHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
        const deleteIconHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>`;
        const closeIconHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`;
        let data = { keywords: [] };
        let isAddKeywordCardVisible = false;
        const Header = () => __awaiter(this, void 0, void 0, function* () {
            const switchEl = document.querySelector(".Switch");
            const slider = document.querySelector(".Slider");
            let switchOn = false;
            const setSwitchOff = () => {
                slider.className = "Slider Slider-Off";
                switchEl.className = "Switch Switch-Off";
            };
            const setSwitchOn = () => {
                slider.className = "Slider Slider-On";
                switchEl.className = "Switch Switch-On";
            };
            chrome.storage.sync.get("switchOn", (items) => {
                switchOn = items.switchOn;
                if (switchOn) {
                    setSwitchOn();
                }
                else {
                    setSwitchOff();
                }
            });
            switchEl.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (switchOn) {
                    yield chrome.storage.sync.set({ switchOn: false });
                    setSwitchOff();
                    switchOn = false;
                }
                else {
                    yield chrome.storage.sync.set({ switchOn: true });
                    setSwitchOn();
                    switchOn = true;
                }
            }));
        });
        const KeywordListItem = (keyword) => {
            const keywordListItem = document.createElement("div");
            keywordListItem.className = "Keyword-List-Item";
            const listListItemTitle = document.createElement("p");
            listListItemTitle.className = "Keyword-List-Item-Title";
            listListItemTitle.innerText = keyword.data;
            keywordListItem.appendChild(listListItemTitle);
            const deleteIcon = document.createElement("div");
            deleteIcon.className = "Delete-Icon";
            deleteIcon.innerHTML = deleteIconHTML;
            keywordListItem.appendChild(deleteIcon);
            deleteIcon.addEventListener("click", () => {
                const newData = {
                    keywords: data.keywords.filter((el) => el.id !== keyword.id),
                };
                chrome.storage.sync.set(newData);
                data = newData;
                loadKeywords();
            });
            return keywordListItem;
        };
        const onFABClick = (event) => {
            if (isAddKeywordCardVisible) {
                const card = document.querySelector(".Add-Keyword-Card");
                bodyEl.removeChild(card);
                fab.innerHTML = addIconHTML;
                isAddKeywordCardVisible = false;
            }
            else {
                const card = document.createElement("div");
                card.className = "Add-Keyword-Card";
                const keywordInput = document.createElement("input");
                keywordInput.className = "Input";
                keywordInput.placeholder = "Enter keyword";
                keywordInput.autofocus = true;
                const addKeyword = () => __awaiter(this, void 0, void 0, function* () {
                    const keyword = keywordInput.value.trim().toLowerCase();
                    if (keyword.length > 0 &&
                        !data.keywords.some((item) => item.data === keyword)) {
                        const newData = {
                            keywords: [
                                ...data.keywords,
                                { id: data.keywords.length + 1, data: keyword },
                            ],
                        };
                        yield chrome.storage.sync.set(newData);
                        data = newData;
                        loadKeywords();
                        keywordInput.value = "";
                    }
                });
                keywordInput.addEventListener("keydown", (event) => __awaiter(this, void 0, void 0, function* () {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        yield addKeyword();
                    }
                }));
                const keywordAddButton = document.createElement("div");
                keywordAddButton.className = "Add-Keyword-Button";
                keywordAddButton.innerText = "Add Keyword";
                card.appendChild(keywordInput);
                card.appendChild(keywordAddButton);
                bodyEl.appendChild(card);
                fab.innerHTML = closeIconHTML;
                isAddKeywordCardVisible = true;
                keywordAddButton.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
                    yield addKeyword();
                }));
            }
        };
        const loadKeywords = () => {
            keywordsListEl.innerHTML = "";
            keywordsListEl.scrollTop = 0;
            if (data.keywords.length > 0) {
                keywordsListEl.className = "Keywords Hidden-Scrollbar Keywords-List";
                const keywords = data.keywords;
                for (let i = keywords.length - 1; i >= 0; i--) {
                    keywordsListEl.appendChild(KeywordListItem(keywords[i]));
                }
            }
            else {
                keywordsListEl.className = "Keywords Keywords-Placeholder";
                const placeholderText = document.createElement("p");
                placeholderText.innerText = "Try adding some keywords!";
                keywordsListEl.appendChild(placeholderText);
            }
        };
        fab.addEventListener("click", onFABClick);
        fab.innerHTML = addIconHTML;
        chrome.storage.sync.get("keywords", (items) => {
            data = items;
            loadKeywords();
        });
        Header();
    });
}
App();
export {};
