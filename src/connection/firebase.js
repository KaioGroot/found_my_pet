// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5sVDH7Y-DQiphWDJy3-7jvy2I3IiT1i4",
  authDomain: "primeiro-projeto-c4aa8.firebaseapp.com",
  databaseURL: "https://primeiro-projeto-c4aa8-default-rtdb.firebaseio.com",
  projectId: "primeiro-projeto-c4aa8",
  storageBucket: "primeiro-projeto-c4aa8.firebasestorage.app",
  messagingSenderId: "739705657694",
  appId: "1:739705657694:web:189dacfa741a30f013d7cf",
  measurementId: "G-27NHSWDRRZ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Exporta as instâncias necessárias
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
