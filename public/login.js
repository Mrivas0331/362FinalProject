// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// Import other Firebase modules as needed (e.g., database, auth)
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries\

//try to encrypt passwords

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const config = await fetch('/firebase-config').then(res => res.json());
const app = initializeApp(config);
const db = getFirestore(app);

const user = document.getElementById('username-in')
const password = document.getElementById('password-in')
const button = document.getElementById('loginsubmit')
const collection = "users"

button.addEventListener('click', async (e) => {
   //gets username from form
   const username = user.value
   const userpass = password.value
   if (!username || !userpass) {
      alert('Please provide both username and password');
      return;
   }
   //establishes firebase user reference
   const uRef = doc(db, collection, username);
   const userSnapshot = await getDoc(uRef);
   const userdata = userSnapshot.data();
   //checks if username doesn't exist in firebase
   if (userdata == undefined) {
      alert('Username or Password doesn\'t exist');
      return; //returns nothing
   }
   //checks that the password matches username
   if (userdata?.password != userpass) {
    alert('Username or Password doesn\'t exist');
    return;
   }

   //adds to the database
   document.cookie = 'username= ' + username + '; Path=/;';
   alert('Login successful, being redirected to home page!')
   window.location.href = '/home.html'
})