# WebLocker Extension

This is a Firefox browser extension that allows you to protect a list of trusted URLs with a password.

## ⚠️ DISCLAIMER

This extension is **not designed to be secure**. The password is stored in plaintext using `browser.storage.local` and can be easily accessed by anyone with access to the browser's developer tools.

**Do not use this extension for sensitive data or to enforce real security boundaries.** It is intended for simple organizational or demonstrative use only.

## 🚀 Features

- ✅ **Password Protection**  
  Set a password to protect the extension's functionality.

- 🌐 **Capture Current Tab Root URL**  
  Automatically extract and store the root (origin) of the currently active tab.

- ➕ **Add & Edit URLs**  
  Add, edit, and delete URLs from your trusted list.

- 📋 **View Stored URLs**  
  Expand a panel to see the list of saved URLs.

- 📦 **Persistent Local Storage**  
  URLs and password are stored using `browser.storage.local`.

## 🧩 Installation

1. Clone or download this repository.
2. Open Firefox and go to `about:debugging`.
3. Click **"This Firefox"** → **"Load Temporary Add-on…"**.
4. Select the `manifest.json` file from this extension’s folder.

