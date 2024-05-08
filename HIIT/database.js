// import { sqlite3 } from 'sqlite3';
const sqlite = require('sqlite3').verbose();
let user;
let workout;
let history;

// connect to db
const db = new sqlite.Database('./workouts.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to HIIT database!');
});

// create user table

const createUserTable = () => {
  user = `
    CREATE TABLE users(
        ID INTEGER PRIMARY KEY,
        user_name TEXT
    )`;

  db.run(user);
};

const createWorkoutTable = () => {
  workout = `
        CREATE TABLE IF NOT EXISTS workouts(
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            workout_name TEXT,
            duration TEXT,
            descriptions TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`;
  db.run(workout);
};

const createHistoryTable = () => {
  history = `
        CREATE TABLE history(
            id INTEGER PRIMARY KEY,
            workout_name TEXT,
            duration TEXT,
            rest TEXT,
            date TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`;
  db.run(history);
};


const queryUsers = () => {
  const sql = 'SELECT * FROM history';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('Error querying users table:', err);
      return;
    }

    // Log the retrieved rows
    console.log('Users:');
    rows.forEach(row => {
      console.log(row);
    });
  });
};


// drop the db
// db.run('DROP TABLE history');

// createUserTable();
// createWorkoutTable();
// createHistoryTable();
queryUsers();
// db.run(workout);
// db.run(history);

// insert data into tables

// user = 'INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)'
