import { auth, db } from './config';

console.log("Firebase Auth:", auth);
console.log("Firebase Firestore:", db);

// Try to get current user
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user.email);
  } else {
    console.log("No user logged in");
  }
});