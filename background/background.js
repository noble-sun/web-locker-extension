const authenticatedUrls = new Set();

browser.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case "check-auth":
      return Promise.resolve(authenticatedUrls.has(message.root));
    case "add-auth":
      authenticatedUrls.add(message.root);
      return Promise.resolve(true);
    default:
      console.log(`no-action-for-message: ${message.type}`);
  }
})
