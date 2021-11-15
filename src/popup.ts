import { Keyword } from "./models";

async function App() {
  const keywordsListEl = document.querySelector(".Keywords") as HTMLDivElement;
  const bodyEl = document.getElementsByTagName("body")[0] as HTMLBodyElement;
  const fab = document.querySelector(".FAB") as HTMLDivElement;
  const addIconHTML: string = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
  const deleteIconHTML: string = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>`;
  const closeIconHTML: string = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`;
  let data = await chrome.storage.sync.get("keywords");
  let isAddKeywordCardVisible: Boolean = false;

  const Header = async () => {
    const switchEl = document.querySelector(".Switch") as HTMLDivElement;
    const slider = document.querySelector(".Slider") as HTMLDivElement;
    let switchOn = (await chrome.storage.sync.get("switchOn"))
      .switchOn as Boolean;

    const setSwitchOff = () => {
      slider.className = "Slider Slider-Off";
      switchEl.className = "Switch Switch-Off";
    };

    const setSwitchOn = () => {
      slider.className = "Slider Slider-On";
      switchEl.className = "Switch Switch-On";
    };

    if (switchOn) {
      setSwitchOn();
    } else {
      setSwitchOff();
    }

    switchEl.addEventListener("click", async () => {
      if (switchOn) {
        await chrome.storage.sync.set({ switchOn: false });
        setSwitchOff();
        switchOn = false;
      } else {
        await chrome.storage.sync.set({ switchOn: true });
        setSwitchOn();
        switchOn = true;
      }
    });
  };

  const KeywordListItem = (keyword: Keyword): HTMLDivElement => {
    const keywordListItem: HTMLDivElement = document.createElement("div");
    keywordListItem.className = "Keyword-List-Item";

    const listListItemTitle: HTMLParagraphElement = document.createElement("p");
    listListItemTitle.className = "Keyword-List-Item-Title";
    listListItemTitle.innerText = keyword.data;
    keywordListItem.appendChild(listListItemTitle);

    const deleteIcon = document.createElement("div");
    deleteIcon.className = "Delete-Icon";
    deleteIcon.innerHTML = deleteIconHTML;
    keywordListItem.appendChild(deleteIcon);

    deleteIcon.addEventListener("click", () => {
      const newData = {
        keywords: data.keywords.filter((el: Keyword) => el.id !== keyword.id),
      };
      chrome.storage.sync.set(newData);
      data = newData;
      loadKeywords();
    });

    return keywordListItem;
  };

  const onFABClick = (event: MouseEvent) => {
    if (isAddKeywordCardVisible) {
      const card = document.querySelector(
        ".Add-Keyword-Card"
      ) as HTMLDivElement;
      bodyEl.removeChild(card);
      fab.innerHTML = addIconHTML;
      isAddKeywordCardVisible = false;
    } else {
      const card: HTMLDivElement = document.createElement("div");
      card.className = "Add-Keyword-Card";

      const keywordInput: HTMLInputElement = document.createElement("input");
      keywordInput.className = "Input";
      keywordInput.placeholder = "Enter keyword";

      const keywordAddButton: HTMLDivElement = document.createElement("div");
      keywordAddButton.className = "Add-Keyword-Button";
      keywordAddButton.innerText = "Add Keyword";

      card.appendChild(keywordInput);
      card.appendChild(keywordAddButton);
      bodyEl.appendChild(card);
      fab.innerHTML = closeIconHTML;
      isAddKeywordCardVisible = true;
      keywordAddButton.addEventListener("click", async (event: MouseEvent) => {
        const keyword: string = keywordInput.value.trim();
        if (keyword.length > 0) {
          const newData = {
            keywords: [
              ...data.keywords,
              { id: data.keywords.length + 1, data: keyword },
            ] as Keyword[],
          };
          await chrome.storage.sync.set(newData);
          data = newData;
          loadKeywords();
        }
      });
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
    } else {
      keywordsListEl.className = "Keywords Keywords-Placeholder";
      const placeholderText: HTMLParagraphElement = document.createElement("p");
      placeholderText.innerText = "Try adding some keywords!";
      keywordsListEl.appendChild(placeholderText);
    }
  };

  fab.addEventListener("click", onFABClick);
  fab.innerHTML = addIconHTML;
  Header();
  loadKeywords();
}

App();
