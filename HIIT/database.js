import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';

const dbPath = 'workout.db';

// Function to create the database file
const createDatabase = async () => {
  try {
    await fs.access(dbPath, fs.constants.F_OK);
    console.log('Database already exists.');
  } catch (err) {
    console.log('Creating database...');
    await fs.writeFile(dbPath, '');
    console.log('Database created successfully.');
  }
};

// Function to connect to the database
const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to HIIT database!');
        resolve(db);
      }
    });
  });
};

// Function to create user table
const createUserTable = async (db) => {
  const user = `
    CREATE TABLE IF NOT EXISTS users(
        ID INTEGER PRIMARY KEY,
        user_name TEXT
    )`;
  await new Promise((resolve, reject) => {
    db.run(user, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Function to create history table
const createHistoryTable = async (db) => {
  const history = `
        CREATE TABLE IF NOT EXISTS history(
            id INTEGER PRIMARY KEY,
            workout_name TEXT,
            duration TEXT,
            rest TEXT,
            date TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`;
  await new Promise((resolve, reject) => {
    db.run(history, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Function to query users
const queryUsers = async (db) => {
  const sql = 'SELECT * FROM users';
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Log the retrieved rows
        console.log('Users:');
        rows.forEach(row => {
          console.log(row);
        });
        resolve();
      }
    });
  });
};

// Usage
const setupDatabase = async () => {
  try {
    await createDatabase();
    const db = await connectToDatabase();
    await createUserTable(db);
    await createHistoryTable(db);
    await queryUsers(db);
  } catch (err) {
    console.error(err.message);
  }
};

setupDatabase();
