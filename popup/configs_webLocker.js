password_button = document.querySelector('#password');
confirm_button = document.querySelector('#submit-password')
new_password_wrapper = document.querySelector("#new-password-wrapper")
current_password_input = document.querySelector('#current-password')

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

// Save or update password
confirm_button.addEventListener('click', () => {
  input = document.querySelector('#password-input')
  confirmation_input = document.querySelector('#password-input-confirmation')
  message_div = document.querySelector('#message')


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


