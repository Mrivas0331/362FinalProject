//import storage from "./storage.js"

const user = document.getElementById('username-enter');
const pass = document.getElementById('password-enter');
const button = document.getElementById('loginsubmit');
///const collection = "users"

button.addEventListener('click', async (e) => {
   //gets username from form
   const username = user.value
   const userpass = pass.value
   if (!username || !userpass) {
      alert('Please provide both username and password');
      console.log("Failed user login");
      return;
   }
   //await storage.setItem("username", "userpass");
   //alert(username + " " + userpass);
})