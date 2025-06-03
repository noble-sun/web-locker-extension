export function showMessage(message, isError = false) {
  const el = document.getElementById("message");
  el.textContent = message;
  el.classList.remove("message-error", "message-success");
  el.classList.add(isError ? "message-error" : "message-success");
}

export function hideElement(el) {
  el.classList.add("display-hide");
}

export function showElement(el) {
  el.classList.remove("display-hide");
}

export function createListItem(list, url, index) {
  const li = document.createElement("li");
  li.innerHTML= `
    <input id="input-url-${index}" type="text"value="${url}" readonly />
    <div class="list-item-button-wrapper">
      <button id="edit-url-${index}">Edit</button>
      <button id="delete-url-${index}">Delete</button>
    </div>
  `

  list.appendChild(li);
  return li;
}
