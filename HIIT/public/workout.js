let instance= document.querySelector(".workout-instance");

let gif = document.querySelector(".gif-start");

let pauseButton = document.querySelector(".pause-button");
let resumeButton = document.querySelector(".resume-button");
let workoutName = document.querySelector(".workout-name");
let duration = document.querySelector(".duration");
let rest = document.querySelector(".rest-time");


let elapsedtime = 0;
let currentTime = 0;
let remainingTime = 0;
let startTime = new Date().getTime();
let restTime = 0;

let currentWorkoutIndex = 0;
let intervalID;

let workoutTrack;
let gifTrack;

let workoutEnd = document.querySelector(".workout-end");
let usedTime = document.querySelector(".used-time");
let workoutCount = document.querySelector(".workout-count");

let totalArray = [];
let count = 0;

let restIncluded = [];
let gifArray = [];
let restArray = [];


fetch('/workout').then((response) => {

    if(!response.ok){
        throw new Error(`Error: ${response.status}`);
    }

    console.log(response);
    return response.json();
}).then((data) => {
    const format = JSON.stringify(data);
    console.log(`response from server: ${format}`);
    console.log(parseInt(data.workout[currentWorkoutIndex].duration));
    console.log(data.workout.length);

    const total = data.workout.map((elem) => {
        
        totalArray.push(parseInt(elem.duration));
        
    })
   let totalDuration = totalArray.reduce((acc, cur) => acc + cur, 0)
   console.log(totalDuration);

   for(let i = 0; i < data.workout.length; i++){
        restIncluded.push(data.workout[i].duration);
        restArray.push(data.workout[i].name);
        gifArray.push(data.workout[i].gif);
        if(i !== data.workout.length - 1){
            restIncluded.push(data.workout[i].rest);
            restArray.push("REST");
            gifArray.push("./gifs/resting.gif");

        }

   }

   console.log(restIncluded)
   console.log(gifArray)
   console.log(restArray)



    // use one instance 

    const updateTimer = () => {
        currentTime = new Date().getTime();

        elapsedtime = Math.floor((currentTime - startTime) / 1000); // milliseconds
        
    
        remainingTime = parseInt(restIncluded[currentWorkoutIndex]) - elapsedtime;


        

        
        
        
        console.log(remainingTime);
        console.log(currentWorkoutIndex)

        if(currentWorkoutIndex  % 2 === 1){
            workoutTrack = restArray[currentWorkoutIndex];
            gifTrack = gifArray[currentWorkoutIndex];
            restTime = restIncluded[currentWorkoutIndex];
            console.log("check");
            pauseButton.style.display = "none";
            resumeButton.style.display = "none";
        }
        else if(currentWorkoutIndex % 2 === 0){
                workoutTrack = restArray[currentWorkoutIndex];
                gifTrack = gifArray[currentWorkoutIndex];
                restTime = restIncluded[currentWorkoutIndex];
                pauseButton.style.display = "block";
                resumeButton.style.display = "block";
                
        }
        
    
        if(remainingTime <= 0){
            clearInterval(intervalID);
            console.log("time exhausted");

            currentWorkoutIndex++;
            console.log(currentWorkoutIndex)
            if(currentWorkoutIndex < restIncluded.length){
                startNextWorkout();

                // workout rest alternation

                
            }
            else{
                pauseButton.disabled = true;
                resumeButton.disabled = true;
                instance.remove();

            
                usedTime.textContent = `${totalDuration}s was spent!`;
                workoutCount.textContent = `${data.workout.length} workout(s) were completed!`;
                workoutEnd.style.display = "block";

            }

        }
    
        duration.textContent = remainingTime
        gif.src = gifTrack  
        workoutName.textContent = workoutTrack  

        
        
    }

    const startNextWorkout = () => {
        startTime = new Date().getTime();
        elapsedtime = 0;
        intervalID = setInterval(updateTimer, 1000)
    }

    startNextWorkout();


    // buttons
    resumeButton.addEventListener('click',() => {
        startTime = new Date().getTime() - elapsedtime * 1000;
        console.log(startTime);
        intervalID = setInterval(updateTimer, 1000);
    })
    
    pauseButton.addEventListener('click',() => {
        resumeButton.disabled = false;
        currentTime = new Date().getTime();
        clearInterval(intervalID);
        elapsedtime = Math.floor((currentTime - startTime) / 1000);
        console.log(elapsedtime);
    })

    


   


}).catch((err) => {
    console.error("error");
    console.log(err);
});




window.addEventListener("beforeunload", (e) => {
    console.log("Going back");
    e.preventDefault()
})