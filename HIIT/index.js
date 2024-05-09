import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let sql;

const sqlite = sqlite3.verbose();

const db = new sqlite.Database('workout.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to HIIT database!');
});
console.log(db);


app.listen(8080, () => {
  console.log('listening @ 8080');
});

app.use(express.static('public'));
app.use(express.json({ imit: '100mb' }));


app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'adduser.html');
  res.sendFile(filePath);
});

app.post('/addUser', (req, res) => {
  const name = req.body.name;

  // Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE user_name = ?';
  db.all(checkUserSql, [name], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }
    if (rows.length > 0) {
      return res.json({ status: 300, success: false, message: 'User already exists' });
    }

    // If user doesn't exist, insert into database
    const insertSql = 'INSERT INTO users(user_name) VALUES (?)';
    db.run(insertSql, [name], (err) => {
      if (err) {
        return res.json({ status: 300, success: false, error: err });
      }
      // User inserted successfully
      return res.json({ status: 200, success: true });
    });
  });
});

app.get('/addUser', (req, res) => {
  sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }
    return res.json({ status: 200, success: true, data: rows });
  });
});


// sending data from client to server
let workoutData;
app.post('/workoutData', (req, res) => {
  try {
    let name;
    let duration;
    let description;

    for (let i = 0; i < req.body.workout.length; i++) {
      name = req.body.workout[i].name;
      duration = req.body.workout[i].duration;
      description = req.body.workout[i].description;
    }

    console.log(req.body);

    console.log(`Name: ${name}, Duration: ${duration}, Description${description}`);

    workoutData = req.body;
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,

    });
  }
});


// sending data from server to client(workout page)...
app.get('/workout', (req, res) => {
  // res.setHeader('Content-Type', 'text/html')
  res.send(workoutData);
});


// get data completed workout data from workout page and save to history table
app.post('/completedWorkoutData', (req, res) => {
  console.log(req.body.name);
  const name = req.body.name;
  const duration = req.body.duration;
  const rest = req.body.rest;
  const date = req.body.date;
  const userID = req.body.userID;

  sql = 'INSERT INTO history (workout_name, duration, rest, date, user_id) VALUES (?, ?, ?, ?, ?);';
  db.run(sql, [name, duration, rest, date, userID], (err) => {
    if (err) {
      console.log('fails at insert', err);
      return res.json({ status: 300, success: false, error: err });
    } else {
      console.log('insert successful');
      return res.json({ status: 200, success: true });
    }
  });
});

app.get('/workoutHistory', (req, res) => {
  sql = 'SELECT * FROM history';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }
    return res.json({ status: 200, success: true, data: rows });
  });
});
