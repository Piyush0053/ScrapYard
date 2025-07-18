
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
require('dotenv').config();

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(json());

app.post('/users', async (req, res) => {
  const { uid, email, displayName, phoneNumber } = req.body;
  
  try {
    await db.collection('users').doc(uid).set({
      email,
      displayName,
      phoneNumber
    });
    res.status(200).send('User data saved successfully');
  } catch (error) {
    console.error('Error inserting user data:', error);
    res.status(500).send('Error inserting user data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
