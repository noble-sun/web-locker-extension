import { getFromLocalStorage, setToLocalStorage } from "./storage.js";
import { showMessage, hideElement } from "./ui.js";

export async function setupAddURL() {
  const urlInput = document.getElementById("add-url-input");

  const captureUrlBtn = document.getElementById("capture-url-btn")
  captureUrlBtn.addEventListener("click", async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    urlInput.value = `${url.protocol}//${url.host}`;
  })

  const addURLWrapper = document.getElementById("add-url-wrapper");
  const addURLBtn = document.getElementById("add-url-btn");
  addURLBtn.addEventListener("click", () => {
    addURLWrapper.classList.toggle("display-hide");
    addURLBtn.classList.toggle("active_button");
  })

  const saveURLBtn = document.getElementById("submit-add-url-btn");
  saveURLBtn.addEventListener("click", async () => {
    const value = urlInput.value.trim();
    if (!value) {
      showMessage("URL cannot be empty", true);
      return;
    }

    const result = await getFromLocalStorage("urlsList");
    const urls = result.urlsList || [];
    if (urls.includes(value)) {
      showMessage("URL already in list", true);
      return;
    }

    urls.push(value);
    await setToLocalStorage({urlsList: urls});

    addURLBtn.classList.remove("active_button");
    hideElement(addURLWrapper);
    showMessage("URL added to list!", false);
  })
}
