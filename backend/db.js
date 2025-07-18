import { createConnection } from 'mysql2';
require('dotenv').config();

const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default connection;
