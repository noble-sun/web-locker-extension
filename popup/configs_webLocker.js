import {setupPassword, isAuthenticated, hasPassword} from "./modules/authentication.js";
import { setupAddURL } from "./modules/addURL.js";

//browser.storage.local.clear();
const message_div = document.querySelector('#message')

async function getList() {
  const result = await browser.storage.local.get("urlsList");

  return result["urlsList"];
}
const url_input = document.querySelector('#url')

async function setupListButton() {
 const  url_list_button = document.querySelector('#url-list-button');
  url_list_button.addEventListener('click', async () => {
    if (url_list_button.classList.contains('active_button')) {
      url_list_button.classList.remove('active_button');

      const list = document.querySelector('#url-list');
      message.innerHTML = '';
      list.classList.add('display-hide');
    } else {
      url_list_button.classList.add('active_button');
      renderList();
    }
  })
}

async function renderList() {
  const list = document.querySelector('#url-list');
  message.innerHTML = '';
  list.innerHTML = '';
  list.classList.remove('display-hide');

  const urls = await getList();

  if (urls.length === 0) {
    list.innerHTML = "No URLs saved";
    list.style.textAlign = "center";
    list.style.padding = "10px 0";
  } else {
    urls.forEach((url, index) => {
      const li = document.createElement('li')
      li.innerHTML= `
            <input id="input-url-${index}" type="text"value="${url}" readonly />
            <div class="list-item-button-wrapper">
              <button id="edit-url-${index}">Edit</button>
              <button id="delete-url-${index}">Delete</button>
            </div>
          `
      list.appendChild(li)

      const edit_button = li.querySelector(`#edit-url-${index}`)
      const delete_button = li.querySelector(`#delete-url-${index}`)
      const url_input = li.querySelector(`#input-url-${index}`)

      delete_button.addEventListener('click', async () => {
        let updated_urls = urls.filter((_, i) => i !== index);
        console.log("updated_list", updated_urls)
        await browser.storage.local.set({ 'urlsList': updated_urls});
        console.log(`remove ${url_input.value}`)
        renderList();
      })

      edit_button.addEventListener('click', async () => {
        if (url_input.readOnly) {
          url_input.removeAttribute('readonly');
          url_input.focus();
          edit_button.innerHTML = 'Save';
        } else {
          const updated_value = url_input.value.trim();

          if (updated_value === '') {
            message_div.classList.add('message-error');
            message_div.innerHTML = "URL cannot be empty"
            url_input.focus();
            return;
          }

          url_input.setAttribute('readonly', true);
          edit_button.innerHTML = 'Edit';
          urls[index] = updated_value;
          await browser.storage.local.set({ urlsList: urls });
          renderList();
        }
      });
    })
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setupPassword();
  setupListButton();
  setupAddURL();
});

