const express = require('express');
const app = express();

let sql;
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./workouts.db', sqlite.OPEN_READWRITE,(err) => {
    if(err) {
        console.error(err.message);
    } 
    console.log("Connected to HIIT database!")
});


app.listen(8080, () => {
    console.log('listening @ 8080')
});

app.use(express.static('public'))
app.use(express.json({imit:'100mb'}))



// sending data from client to server
let workoutData;
app.post('/', (req, res) => {
    
    try {
        // sql = {name, duration, gif, rest, type}
        console.log(req.body.workout[0].duration);
        workoutData = req.body;
        return res.json({
        status:200,
        success: true,
        });
        res.send(); // send to client
    } catch (error) {
        return res.json({
            status:400,
            success: false,
            
        })
        console.log(error)
    }
    
 
    
})


// sending data from server to client...
app.get('/workout',(req, res) => {

    // res.setHeader('Content-Type', 'text/html')
    res.send(workoutData);
});
