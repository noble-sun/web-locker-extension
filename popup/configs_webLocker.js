password_button = document.querySelector('#password');
confirm_button = document.querySelector('#submit-password')
new_password_wrapper = document.querySelector("#new-password-wrapper")
current_password_input = document.querySelector('#current-password')

//browser.storage.local.clear();
// Change button name if password is already set or not
let passwordExist = false
function setPasswordButtonName() {
  browser.storage.local.get("password").then((result) => {
    if (result.password === undefined) {
      password_button.innerHTML = "Set Password"
    } else {
      passwordExist = true
      password_button.innerHTML = "Change Password"
    }
  })
}

// Set or update password
setPasswordButtonName();
password_button.addEventListener('click', (e) => { 
  // Show current password input if password is set
  if (passwordExist === true) {
    current_password_input.type = "password";
  }
  new_password_wrapper.style.display = 'block';
})

message_div = document.querySelector('#message')
// Save or update password
confirm_button.addEventListener('click', () => {
  input = document.querySelector('#password-input')
  confirmation_input = document.querySelector('#password-input-confirmation')


  browser.storage.local.get("password").then((result) => {
    if (current_password_input.type === 'password' && current_password_input.value !== result.password) {
      message_div.innerHTML = "Wrong current password!!!"
      return;
    }
 
    if (input.value === confirmation_input.value && input.value !== '') {
      let password = {}
      password['password'] = input.value
      browser.storage.local.set(password)

      setPasswordButtonName();
      message_div.innerHTML = "Password set successfully!";
      new_password_wrapper.style.display = 'none';
      current_password_input.type = 'hidden';
    } else {
      message_div.innerHTML = "Password and confirmation are not the same";
    }
  }) 
});

async function appendToURLList(value) {
  const result = await browser.storage.local.get("urlsList");
  const currentList = result["urlsList"] || [];

  if (!currentList.includes(value)) {
    currentList.push(value);
    console.log('currentArray', currentList)
    await browser.storage.local.set({ 'urlsList': currentList});
  } else {
    console.log("already on list")
  }
}

async function getList() {
  const result = await browser.storage.local.get("urlsList");

  return result["urlsList"];
}

url_input = document.querySelector('#url')

capture_url_button = document.querySelector('#capture-url-button')
capture_url_button.addEventListener('click', async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tabs[0].url);
  const root = `${url.protocol}//${url.host}`;

  url_input.value = root
});
add_to_list_wrapper = document.querySelector('#add-to-list-wrapper')
add_url_button = document.querySelector('#add-url')
add_url_button.addEventListener('click', () => {
  add_to_list_wrapper.classList.remove('add-to-list')
});

save_to_list = document.querySelector('#save-to-list')
save_to_list.addEventListener('click', async () => {
  await appendToURLList(url_input.value);

  add_to_list_wrapper.classList.add('add-to-list')
  message_div.innerHTML = "URL added to list!"
});

async function setupListButton() {
  url_list_button = document.querySelector('#url-list-button');
  url_list_button.addEventListener('click', async () => {
    renderList();
  })
}

async function renderList() {
  const list = document.querySelector('#url-list');
  message.innerHTML = '';
  list.innerHTML = '';
  list.classList.remove('display-hide');

  const urls = await getList();

  urls.forEach((url, index) => {
    li = document.createElement('li')
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
      updated_urls = urls.filter((_, i) => i !== index);
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
        const updated_value = url_input.value;

        if (updated_value === '') {
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

setupListButton();
