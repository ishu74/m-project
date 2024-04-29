import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    // apiKey: "AIzaSyDSqeXDPPVCQSi1XB7_-tXFl0V3hwr7FK4",
    // authDomain: "project1-1c0f4.firebaseapp.com",
    // projectId: "project1-1c0f4",
    // storageBucket: "project1-1c0f4.appspot.com",
    // messagingSenderId: "499188247747",
    // appId: "1:499188247747:web:55c1673886d0e9f0bf4676"

    apiKey: "AIzaSyBMlyee3r1ScfeOZfjZAtMFawRBX7Yul0U",
  authDomain: "test-9cc23.firebaseapp.com",
  projectId: "test-9cc23",
  storageBucket: "test-9cc23.appspot.com",
  messagingSenderId: "632856101519",
  appId: "1:632856101519:web:012b4ae30e898c105a26fa",
  measurementId: "G-3EQ5YTH5JP",
  serviceAccount: "serviceAccount.json",
  databaseURL: "https://test-9cc23-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

