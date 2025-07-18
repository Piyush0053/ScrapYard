import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { query as _query } from './db';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(json());

app.post('/users', (req, res) => {
  const { uid, email, displayName, phoneNumber } = req.body;
  const query = 'INSERT INTO users (uid, email, displayName, phoneNumber) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = ?, displayName = ?, phoneNumber = ?';
  const values = [uid, email, displayName, phoneNumber, email, displayName, phoneNumber];

  _query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting user data:', err);
      return res.status(500).send('Error inserting user data');
    }
    res.status(200).send('User data saved successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
