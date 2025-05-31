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

browser.tabs.onRemoved.addListener(async (tab_id, _) => {
  for (const root of Array.from(authenticatedUrls)) {
    let tabs = await browser.tabs.query({url: `${root}/*`});
    tabs = tabs.filter(tab => tab.id !== tab_id);

    if (tabs.length === 0) {
      authenticatedUrls.delete(root);
    }
  }
})
