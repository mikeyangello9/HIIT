const express = require('express');
const app = express();
const path = require('path');
let sql;

const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./workouts.db', sqlite.OPEN_READWRITE, (err) => {
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
  res.sendFile(path.join(__dirname, 'public', 'adduser.html'));
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
  // send query of db
  sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ status: 300, success: false, error: err });
    }
    return res.json({ status: 200, success: true, data: rows });
  });
});

//

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
