const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log('listening @ 8080')
});

app.use(express.static('public'))
app.use(express.json({imit:'100mb'}))



// routing
let workoutData;
app.post('/', (req, res) => {
    console.log(req.body);
    workoutData = req.body;
    res.send()
})

app.get('/workout',(req, res) => {

    // res.setHeader('Content-Type', 'text/html')
    res.send(workoutData);
});


// serve webpages to client 
   // index.html
// 