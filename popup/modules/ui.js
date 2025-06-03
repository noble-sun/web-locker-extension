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
