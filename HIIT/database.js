// import { sqlite3 } from 'sqlite3';

const sqlite = require('sqlite3').verbose();
let user;
let workout;
let history;

//connect to db
const db = new sqlite.Database('./workout.db', sqlite.OPEN_READWRITE,(err) => {
    if(err) {
        console.error(err.message);
    } 
    console.log("Connected to HIIT database!")
});

// create user table

const createWorkoutTable = () => {
    workout = `
        CREATE TABLE IF NOT EXIST workouts(
            id INTEGER PRIMARY KEY,
            workout_name TEXT,
            duration TEXT,
          
            
        )
    `
}





// drop the db
db.run('DROP TABLE users');

// insert data into tables

// user = 'INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)'