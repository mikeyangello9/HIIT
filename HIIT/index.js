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



let userData;




// sending data from client to server
let workoutData;
app.post('/', (req, res) => {
    try {
        let name;
        let duration;
        let description;

        for(let i = 0; i < req.body.workout.length; i++){
            name = req.body.workout[i].name;
            duration = req.body.workout[i].duration;
            description = req.body.workout[i].description;
        }

       
        
        console.log(req.body);

        console.log(`Name: ${name}, Duration: ${duration}, Description${description}`);
        
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
        console.log(error);
    }
    
 
    
})


// sending data from server to client(workout page)...
app.get('/workout',(req, res) => {

    // res.setHeader('Content-Type', 'text/html')
    res.send(workoutData);
});
