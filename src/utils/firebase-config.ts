import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId:  process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId:  process.env.MESSAGINGSENDERID,
  appId:  process.env.APPID,
  measurementId:  process.env.MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
