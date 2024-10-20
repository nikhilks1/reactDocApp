import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDy_U3XNCnWCN4LKiUJNTHELTW9x_pgHTU",
    authDomain: "docs-app-285a7.firebaseapp.com",
    projectId: "docs-app-285a7",
    storageBucket: "docs-app-285a7.appspot.com",
    messagingSenderId: "145427752491",
    appId: "1:145427752491:web:4e6ca1566ef0ca63512c6e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const deleteDocument = async (docId) => {
    try {
        await deleteDoc(doc(db, 'documents', docId));
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error; // Rethrow the error for the parent component to handle
    }
};

export { db,deleteDocument };