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

const createUserTable = () =>{
    user = ` 
    CREATE TABLE users(
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT UNIQUE,
        password TEXT,
        weight REAL,
        height REAL
    )`;
};


const createWorkoutTable = () => {
    workout = `
        CREATE TABLE workouts(
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