// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ We'll add real config after creating Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyC-9x8lKEc7b_Dq8K3-TqlBKpRKXbrGgpA",
  authDomain: "jobify-c4829.firebaseapp.com",
  projectId: "jobify-c4829",
  storageBucket: "jobify-c4829.firebasestorage.app",
  messagingSenderId: "1028796771726",
  appId: "1:1028796771726:web:f704162494bc95f96c08df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { auth, db, storage };