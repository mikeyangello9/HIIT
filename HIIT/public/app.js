const date = document.querySelector(".date");
const greetUser = document.querySelector(".greet-user");
const today = new Date();


date.textContent = `${today.getDate()} - 0${today.getMonth() + 1} - ${today.getFullYear()}`;

 
// greet user
const hours = today.getHours();
// console.log(hours)

if(hours >= 0 && hours <= 11){
    greetUser.textContent = "Good morning user";
}else if(hours > 11 && hours < 18){
    greetUser.textContent = "Good Afternoon user";
}
else if(hours >= 18 && hours <= 21){
    greetUser.textContent = "Good Evening user";
}
else{
    greetUser.textContent = "Good Night user";
}



// calender
const dyn = new Date();
const calender = document.querySelector(".calender");

const calenderDate =  new Date(dyn.getYear(), dyn.getMonth() + 1, 0);
const allDaysInMonth = calenderDate.getDate();
// console.log(calenderDate.getMonth());

for(let i = 0; i < 7; i++){
  const visual = document.createElement("div");
  
  visual.textContent = i + 1;
  visual.style.color = 'white';
  visual.style.display = 'inline';
  visual.style.padding = '12px';
  visual.style.margin = '4px';
  visual.style.background = 'black';
  visual.style.borderRadius = '10px';
  visual.style.borderRadius = '10px';
  visual.style.textAlign = 'center';

//   console.log(i)

  if(i + 1 == today.getDate()){
    visual.style.border = "2px solid white"
  }
  calender.appendChild(visual);
}

// dashboard
const totalDuration = document.querySelector(".total-duration");
const totalworkoutsSelected = document.querySelector(".total-workouts");


const selectionButtons = document.querySelectorAll('.select-work');
const workouts = document.querySelectorAll('.workout');
let selectedWorkouts = document.querySelector('.selected-workouts');
const removeButtons = document.querySelectorAll(".remove-button");
const start = document.querySelector(".start");
const que = document.querySelector(".que");
que.style.display = "#adff2f"


// custom hub

const customHub = document.querySelector(".customhub");
const customiseButton = document.querySelector(".customise");
const closeCustomHub = document.querySelector(".close-button");

const customWorkout = document.querySelector("#workout");
const customDuration = document.querySelector("#duration");
const customDescription = document.querySelector("#description");
const customRest = document.querySelector("#rest");

const addCustomWorkout = document.querySelector(".add-button");


customiseButton.addEventListener('click', () => {
    customHub.style.display = "block";
});

// window.addEventListener('click',() => {customHub.style.display = "none";})
closeCustomHub.addEventListener('click', () => {
    customHub.style.display = "none";
});







let selectedWorkoutArray = [];

if(selectedWorkouts.innerHTML === ""){
    console.log("Here");
    start.disabled = true;
    start.style.background = "none"
}

const startHandler = () => {
     // start button 
     start.disabled = false;
     start.style.background = "#adff2f"
     start.style.color = "black"
}


// handle workout selections


const serve = (userSelection) => {
    let data = { 
    workout: userSelection,
    }

    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }


    fetch('/', options)
    .then((response) => {
        if(!response.ok){
            throw new Error("response was not ok!");
        }

        if(response.status === 204){
            throw new Error("response is empty")
        }
        return response.json();
    }).then(data => {
        console.log(`server response ${data}`);
    }).catch(error => console.error(`something has gone awry: ${error}`));

}




let dataExtract = [];

const selectWorkouts = (index) => {
    selectedWorkouts.appendChild(workouts[index].cloneNode(true));

    console.log(selectedWorkouts);
    selectedWorkoutArray.push(selectedWorkouts.querySelectorAll('.workout'));
    const lastElem = selectedWorkoutArray[selectedWorkoutArray.length - 1]


    startHandler();

   
   
    dataExtract = [];

    
    lastElem.forEach(element => {
        const workoutServerData = {
            duration:element.querySelector(".time").textContent,
            name:element.querySelector(".workout-name").textContent,
            gif:element.querySelector(".gifs").src,
            rest:element.querySelector(".rest-time").textContent,
        }
        dataExtract.push(workoutServerData);
        
    

        console.log(dataExtract)
        serve(dataExtract)
    });
   
    const afterSelections = selectedWorkouts.querySelectorAll(".select-work");
    afterSelections.forEach(afterSelection => {
        afterSelection.remove();
    });


    const indications = selectedWorkouts.querySelectorAll(".workout");

    indications.forEach((indication, index) => {
        // get content and restyle

        indication.style.background = '#adff2f';
        indication.style.marginTop = '5px';
        indication.style.borderRadius = '10px'; 
        indication.style.height = 'auto'; 
        indication.style.display = 'flex'; 
        indication.style.justifyContent = 'space-around'; 
        indication.style.padding = '1rem'; 
        indication.style.overflow = 'auto';
        
        
    
        // Display remove button
        removeButtons[index].style.display = 'block';
        removeButtons[index].textContent = 'X';
        indication.appendChild(removeButtons[index]); // Append remove button to indication
    
        // Desc, duration, and image styling
        const image = indication.querySelector(".workout-image");
        const descDiv = indication.querySelector(".desc-container");
        const desc = indication.querySelector(".desc");
        const description = indication.querySelector(".description");
        const detail = indication.querySelector(".details");
        const name = indication.querySelector(".workout-name");
        const time = indication.querySelector(".time");
        

        detail.style.display = "none"
        desc.textContent = `Workout-name:${name.textContent} Duration: ${time.textContent}`
        description.style.display = "none"
        if (image) {
            image.style.width = "100px";
            image.style.height = "100px";
            image.style.position = "static";
            image.style.borderRadius = "10px";
            image.style.border = "1px solid black";
        }
        if (descDiv) {
            descDiv.style.marginTop = "0px";
        }
       
            
    });

    

    que.style.display = "block";
    que.textContent = "workout Selected";
    que.style.background = "#adff2f"
    setTimeout(() =>{
        que.style.display = "none"
    },3000)
}

// handle remove workout
let lastArray = [];

const removeWorkouts = event => {
   
    
    const removed = selectedWorkouts.querySelectorAll('.workout');
    console.log(removed.length);

    const parentElement = event.target.parentElement;

    let index = Array.from(parentElement.parentElement.children).indexOf(parentElement);
    console.log("Index of the removed element:", index);

    // extract data from nodelist
    lastArray = selectedWorkoutArray[selectedWorkoutArray.length - 1];
    
    const updatedArray = Array.from(lastArray);

    // Remove the element
    parentElement.remove();

    updatedArray.splice(index, 1); // remove one element from the ever changing index
    
   
 

    // if target is removed update array accordingly
    
    
    console.log(updatedArray)
    selectedWorkoutArray[selectedWorkoutArray.length - 1] = updatedArray;

    
    const dataRemoved = [];
    updatedArray.forEach(element => {
       

        const updatedWorkoutServerData = {
            duration:element.querySelector(".time").textContent,
            name:element.querySelector(".workout-name").textContent,
            gif:element.querySelector(".gifs").src,
            rest:element.querySelector(".rest-time").textContent
        }
        dataRemoved.push(updatedWorkoutServerData);
      
        // dataRemoved.push(element.querySelector(".time"))
        console.log(dataRemoved)
        serve(dataRemoved)
    });

    if(updatedArray.length === 0){
        console.log("should be empty")
        dataRemoved.push([]);
        start.disabled = true;
        start.style.background = "grey";
        serve(dataRemoved);
    }

    que.style.display = "block"
    que.style.background = "red"
    que.textContent = "workout removed"
    setTimeout(() =>{
        que.style.display = "none";
    },3000)
    

        
}



// select workouts by appending to empty div upon user input
selectionButtons.forEach((selectionButton, index) => {
    
    selectionButton.addEventListener('click', () => selectWorkouts(index));

    // remove unwanted/mistake selections and update array 
    removeButtons[index].addEventListener('click', removeWorkouts);

    
});


console.log(selectedWorkoutArray)
const logInput = () => {

    let removeCustomWorkouts = document.createElement("button");
    let customWorkoutData;


    startHandler();
    console.log(customDescription.value)
    console.log(customDuration.value)
    console.log(customWorkout.value)
    console.log(customRest.value)
    customWorkoutData = {
        duration:customDuration.value,
        name:customWorkout.value,
        gif:"",
        rest:customRest.value
    }
    // append to selectedworkouts array

    const customWorkoutDiv = document.createElement("div");
    const customDesc = document.createElement("p");
   
    removeCustomWorkouts.textContent = "X";
    removeCustomWorkouts.style.border = "none";
    removeCustomWorkouts.style.padding = "8px";
    removeCustomWorkouts.style.borderRadius = "8px";
    customDesc.style.padding = "8px";

   
    
    


    const removeCustomWorkoutsfunc = (event) => {
        const workoutDiv = removeCustomWorkouts.parentElement;
        workoutDiv.remove();
        dataExtract.pop(customWorkoutData);
        serve(dataExtract);
        start.disabled = "true"
        start.style.color= "grey"
    }
    
    
    removeCustomWorkouts.addEventListener('click', removeCustomWorkoutsfunc)
    
        


    customDesc.textContent = `Workout-name:${customWorkoutData.name}, Duration:${customWorkoutData.duration}`
    customWorkoutDiv.style.display = "flex";
    customWorkoutDiv.style.justifyContent = "space-around";
    customWorkoutDiv.style.background = "orange";
    customWorkoutDiv.style.padding = "10px";
    customWorkoutDiv.style.borderRadius = "10px";
    customWorkoutDiv.append(customDesc);
    customWorkoutDiv.append(removeCustomWorkouts);

    selectedWorkouts.append(customWorkoutDiv);
    dataExtract.push(customWorkoutData);
    serve(dataExtract);
}


//  button function
setInterval(() => {
    totalworkoutsSelected.textContent = `Total workout selecte: ${dataExtract.length}`
},1000)


            


addCustomWorkout.addEventListener('click',logInput);


