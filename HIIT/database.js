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
        CREATE TABLE IF NOT EXISTS history(
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            workout_id INTEGER,
            date TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (workout_id) REFERENCES workouts(id)
        )`;
  db.run(history);
};


const queryWorkouts = () => {
  const sql = 'SELECT * FROM workouts';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log('Error querying workouts table:', err);
      return;
    }

    // Log the retrieved rows
    console.log('Workouts:');
    rows.forEach(row => {
      console.log(row);
    });
  });
};


// drop the db
// db.run('DROP TABLE users');

// createUserTable();
// createWorkoutTable();
createHistoryTable();
queryWorkouts();
// db.run(workout);
// db.run(history);

// insert data into tables

// user = 'INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)'
