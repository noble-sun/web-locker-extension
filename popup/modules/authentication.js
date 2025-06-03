import { getFromLocalStorage, setToLocalStorage } from "./storage.js";
import { showMessage, showElement, hideElement } from "./ui.js";

export let isAuthenticated = false;
export let hasPassword = false;

export function setupPassword() {
  const configPasswordBtn = document.getElementById("config-password");
  const authWrapper = document.getElementById("popup-authentication");
  const newPasswordWrapper = document.getElementById("new-password-wrapper");
  const newPasswordCurrentInput = document.getElementById("current-password");
  const popupContent = document.getElementById("popup-content");

  async function setPasswordButton() {
    const { password } = await getFromLocalStorage("password");
    if (password === undefined) {
      configPasswordBtn.innerHTML = "Set Password";
      authWrapper.classList.add('display-hide');
    } else {
      hasPassword = true;
      configPasswordBtn.innerHTML = "Change Password";
    }
  }

  configPasswordBtn.addEventListener("click", async () => {
    const btnActive = configPasswordBtn.classList.contains("active_button");
    if (btnActive) {
      hideElement(newPasswordWrapper);

      if (hasPassword) showElement(authWrapper);
      if (isAuthenticated) {
        showElement(popupContent);
        hideElement(authWrapper);
      }
    } else {
      if (!hasPassword) hideElement(newPasswordCurrentInput);
      hideElement(authWrapper);
      hideElement(popupContent);
      showElement(newPasswordWrapper);
    }
    configPasswordBtn.classList.toggle("active_button");
  });

  const configPasswordCancelBtn = document.getElementById("return");
  configPasswordCancelBtn.addEventListener("click", () => {
    configPasswordBtn.classList.remove("active_button");
    hideElement(newPasswordWrapper);
    isAuthenticated ? showElement(popupContent) : showElement(authWrapper);
    showMessage("");
  })

  const submitNewPasswordBtn = document.getElementById("submit-password");
  submitNewPasswordBtn.addEventListener("click", async () => {
    const currentPassword = newPasswordCurrentInput.value.trim();
    const newPassword = document.getElementById("new-password-input").value.trim();
    const newPasswordConfirmation = document.getElementById("new-password-input-confirmation").value.trim();
    const { password } = await getFromLocalStorage("password");

    if (password && currentPassword !== password) {
      showMessage("Wrong current password!!!", true);
      return;
    }

    if (newPassword && newPassword === newPasswordConfirmation) {
      await setToLocalStorage({ password: newPassword });
      await setPasswordButton();
      showMessage("Password Successfully configured!", false);
      hideElement(newPasswordWrapper);
      configPasswordBtn.classList.remove("active_button");
      isAuthenticated ? showElement(popupContent) : showElement(authWrapper);
    } else {
      showMessage("Password and confirmation are not the same", true);
    }
  });


  const popupLoginButton = document.getElementById("popup-authentication-button");
  popupLoginButton.addEventListener("click", async () => {
    const popupLoginInput = document.getElementById("popup-authentication-password");
    const { password } = await getFromLocalStorage("password");

    if (popupLoginInput.value.trim() === password) {
      isAuthenticated = true;
      hideElement(authWrapper);

      showElement(popupContent)
      showMessage("");
    } else {
      showMessage("Incorrect Password", true);
    }
  })

  setPasswordButton();
}
