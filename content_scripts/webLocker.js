(() => {
  browser.storage.local.get("urlsList").then((result) => {
    //If url is not on the list, early exit the script so it doesn't lock the page
    const urls = result["urlsList"];
    const url = new URL(document.URL);
    const root = `${url.protocol}//${url.host}`;
    if (!urls.includes(root)) return;

    /*
     * The page might flicker when hidding the content. To minimize this as much as
     * possible, on manifest.json the content script is being injected at run_at: document_start,
     * so the .js file is being executed even before the DOM finish loading. Since
     * there is no guarantee that the body or html is loaded to apply a style to
     * hide the content, we're adding a new tag <style> and setting the css style
     * to hide the display for html and body tags.
     */
    const style = document.createElement('style');
    style.textContent = `
    html, body {
      display: none !important;
    }
    `;

    document.documentElement.appendChild(style);

    function injectModal() {
      // When this function is called, DOM finished loading, so we can remove this
      style.remove();

      /*
       * Hide the body with a class, create a new body to have the modal in,
       * and replace the actual page body with the temporary body where the modal
       * is in.
       */
      const mainBody = document.body
      mainBody.classList.add('weblocker-extension-display-none');

      const tempBody = document.createElement('body');
      tempBody.id = 'weblocker-extension-body';

      const modal = document.createElement('div');
      modal.className = 'weblocker-extension-modal';

      modal.innerHTML = `
      <input type="password" class="weblocker-extension-input" placeholder="Enter keyword" />
      <button class="weblocker-extension-button">Unlock</button>
      <div class="weblocker-extension-message"></div>
      `

      tempBody.appendChild(modal);
      document.documentElement.replaceChild(tempBody, mainBody);

      const input = modal.querySelector('.weblocker-extension-input')
      const button = modal.querySelector('.weblocker-extension-button')
      const message = modal.querySelector('.weblocker-extension-message')

      let password
      browser.storage.local.get("password").then((result) => {
        password = result.password
      })

      // Check password on button click and replace the body tags again if correct
      button.addEventListener('click', () => {
        if (input.value === password) {
          document.documentElement.replaceChild(mainBody, tempBody);
          mainBody.classList.remove('weblocker-extension-display-none');
        } else {
          message.textContent = "Incorrect Password.";
        }
      });
    }

    // This checks if the DOM finished loading to inject the modal
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", injectModal);
    } else {
      injectModal();
    }
  })
})();
