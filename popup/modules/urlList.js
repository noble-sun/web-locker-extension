import { getFromLocalStorage, setToLocalStorage } from "./storage.js";
import { showMessage, showElement, hideElement, createListItem } from "./ui.js";

export async function setupURLList() {
  const urlListBtn = document.getElementById("url-list-button");
  urlListBtn.addEventListener("click", async () => {
    urlListBtn.classList.toggle("active_button");

    if (urlListBtn.classList.contains("active_button")) {
      await renderList();
    } else {
      const urlList = document.getElementById("url-list");
      hideElement(urlList);
    }
  });
};

async function renderList() {
  const urlList = document.getElementById("url-list");
  urlList.innerHTML = "";
  showElement(urlList);

  const { urlsList } = await getFromLocalStorage("urlsList");
  const urls = urlsList || [];

  if (urls.length === 0) {
    urlList.innerHTML = `
      <div style="text-align:center; padding:10px 0;">
        No URLs saved
      </div>
    `;
    return;
  }

  urls.forEach((url, index) => {
    const li = createListItem(urlList, url, index);

    const urlInput = li.querySelector(`#input-url-${index}`);
    const editBtn = li.querySelector(`#edit-url-${index}`);
    editBtn.addEventListener("click", async () => {
      if (urlInput.readOnly) {
        urlInput.removeAttribute("readonly");
        urlInput.focus();
        editBtn.innerHTML = "Save";
      } else {
        const updatedValue = urlInput.value.trim();
        if (!updatedValue) {
          showMessage("URL cannot be empty", true);
          return;
        }

        urlInput.setAttribute("readonly", true);
        editBtn.innerHTML = "Edit";
        urls[index] = updatedValue;
        await setToLocalStorage({ urlsList: urls});
        renderList();
      }
    })

    const deleteBtn = li.querySelector(`#delete-url-${index}`);
    deleteBtn.addEventListener("click", async () => {
      const updatedList = urls.filter((_,i) => i !== index);
      await setToLocalStorage({ urlsList: updatedList});
      renderList();
    });
  })
}
