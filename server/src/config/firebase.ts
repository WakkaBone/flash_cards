import { initializeApp } from "firebase/app";
import { config } from "dotenv";
import { getFirestore } from "firebase/firestore";
config();

const firebase = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const db = getFirestore(firebase);
