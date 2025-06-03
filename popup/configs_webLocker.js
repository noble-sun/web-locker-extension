import { setupPassword, isAuthenticated, hasPassword } from "./modules/authentication.js";
import { setupAddURL } from "./modules/addURL.js";
import { setupURLList } from "./modules/urlList.js";

//browser.storage.local.clear();
document.addEventListener('DOMContentLoaded', async () => {
  setupPassword();
  setupURLList();
  setupAddURL();
});

