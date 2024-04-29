// countdown
const countDown = document.querySelector(".countdown-display");
const values = ["3", "2", "1", "GO"];
let index = 0;

const countdownInterval = setInterval(() => {
    if(index < values.length){
    countDown.textContent = values[index]; // update the value of index if it's value is less than the array length 
    index++;
}
else{
    clearInterval(countdownInterval);
    countDown.style.display = "none";
}
}, 1000)




let instance= document.querySelector(".workout-instance");
let nextWorkout = document.querySelector(".next-workout");

let nextWorkoutImage = document.querySelector(".next-image");
instance.style.display = "none";
nextWorkout.style.display = "none";

nextWorkoutImage.style.display = "none";
setTimeout(() => {

instance.style.display = "block";
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
let imageArray = [];

// alert user that work is about to start

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
        imageArray.push(data.workout[i].image);
        if(i !== data.workout.length - 1){
            restIncluded.push(data.workout[i].rest);
            restArray.push("REST");
            gifArray.push("./gifs/resting.gif");
            imageArray.push("./images/restingimage.jpg");
        };
      


   }
   console.log(restIncluded)
   console.log(gifArray)
   console.log(restArray)
   console.log(imageArray)
   // show next workout




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
            nextWorkoutImage.src = "./images/workoutsomplete.png";
            nextWorkout.textContent = "Well Done!!"
                
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
        
        nextWorkout.style.display ="block";
        // nextWorkout.textContent =`UPNEXT: ${restArray[currentWorkoutIndex + 1]}`;
        nextWorkoutImage.style.display = "block";
        // nextWorkoutImage.src = imageArray[currentWorkoutIndex + 1];

        if(currentWorkoutIndex + 1 < restArray.length){
            nextWorkout.textContent =`UPNEXT: ${restArray[currentWorkoutIndex + 1]}`;
            nextWorkoutImage.src = imageArray[currentWorkoutIndex + 1];
        }
        else{
            nextWorkout.textContent =`workouts exhausted`;
            nextWorkoutImage.src = "";
        }


        
        
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
        pauseButton.disabled = false;
        
    })
    
    pauseButton.addEventListener('click',() => {
        resumeButton.disabled = false;
        currentTime = new Date().getTime();
        clearInterval(intervalID);
        elapsedtime = Math.floor((currentTime - startTime) / 1000);
        console.log(elapsedtime);
        pauseButton.disabled = true;
    })


    // newline
    


   


}).catch((err) => {
    console.error("error");
    console.log(err);
});




window.addEventListener("beforeunload", (e) => {
    console.log("Going somewhere?")
    e.preventDefault()
})
}, 5000)

