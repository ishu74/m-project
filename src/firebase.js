import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyDSqeXDPPVCQSi1XB7_-tXFl0V3hwr7FK4",
    authDomain: "project1-1c0f4.firebaseapp.com",
    projectId: "project1-1c0f4",
    storageBucket: "project1-1c0f4.appspot.com",
    messagingSenderId: "499188247747",
    appId: "1:499188247747:web:55c1673886d0e9f0bf4676"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

