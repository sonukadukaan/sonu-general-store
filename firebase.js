// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_2n6UfYTDR7Spk_T5X-2LPkzcer0r0XQ",
  authDomain: "sonu-general-store.firebaseapp.com",
  projectId: "sonu-general-store",
  storageBucket: "sonu-general-store.firebasestorage.app",
  messagingSenderId: "1049320171778",
  appId: "1:1049320171778:web:5b8adfe8d05bb5b3b8fa1b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);