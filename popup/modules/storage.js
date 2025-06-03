export async function getFromLocalStorage(key) {
  return await browser.storage.local.get(key);
}

export async function setToLocalStorage(obj) {
  return await browser.storage.local.set(obj);
}
