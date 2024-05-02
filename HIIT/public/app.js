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
const dateNow = new Date();
const calender = document.querySelector(".calender");

const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

const dayOfWeek = daysOfWeek[dateNow.getDay()];

const time = dateNow.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric"});

console.log(`${dayOfWeek} ${time}`);



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


const intensitySelector = document.querySelector(".workout-intensity");
const intensityList = document.getElementById("intensity-list");
const changeDuration = document.querySelectorAll(".time");
const changeRest = document.querySelectorAll(".rest-time");

// select intensity of workout
intensityList.addEventListener("change", () => {
    const difficultyList = intensityList.selectedOptions;
    let level;
    for(let i = 0; i < difficultyList.length; i++){
        console.log(difficultyList[i]);

        if(difficultyList[i].text === "Light"){
            level = difficultyList[i].value;    
        }
        else if(difficultyList[i].text === "Medium"){
            level = difficultyList[i].value;
        }
        else if(difficultyList[i].text === "Intense"){
            level = difficultyList[i].value;
        }
    }

    console.log(level)
    changeRest.forEach((exercise, index) => {
        exercise.textContent = level;
        // changeDuration[index].textContent = 
        
    })
})

customiseButton.addEventListener('click', () => {
    customHub.style.display = "block";
});

// window.addEventListener('click',() => {customHub.style.display = "none";})
closeCustomHub.addEventListener('click', () => {
    customHub.style.display = "none";
});




const startHandler = () => {
     // start button
     start.disabled = false;
     start.style.background = "#adff2f"
     start.style.color = "black"
}



let selectedWorkoutArray = [];
const divContent = selectedWorkouts.innerHTML


// before sele3ctions of workouts
if(divContent === ""){
    start.disabled = true;
    start.style.background = "none";
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



const selectWorkouts = (index) => {
    selectedWorkouts.appendChild(workouts[index].cloneNode(true));

    console.log(selectedWorkouts);
    selectedWorkoutArray.push(selectedWorkouts.querySelectorAll('.workout'));
    const lastElem = selectedWorkoutArray[selectedWorkoutArray.length - 1]


    startHandler();

    let dataExtract = [];

    
    lastElem.forEach(element => {

       const workoutServerData = {
            duration:element.querySelector(".time").textContent,
            name:element.querySelector(".workout-name").textContent,
            gif:element.querySelector(".gifs").src,
            rest:element.querySelector(".rest-time").textContent,
            type:"premade",
            description: element.querySelector(".description").textContent
        }

        dataExtract.push(workoutServerData);
        console.log(dataExtract);
        serve(dataExtract);

        if(dataExtract.length != 0){
            customiseButton.disabled = true;
            customiseButton.style.color = "grey";
        }

        if(dataExtract.length == 0){
            console.log("empty");
        }
        
    });

    const afterSelections = selectedWorkouts.querySelectorAll(".select-work");
    afterSelections.forEach(afterSelection => {
        afterSelection.remove();
    });


    const indications = selectedWorkouts.querySelectorAll(".workout");

    indications.forEach((indication, index) => {
        // get content and restyle

        indication.style.background = '#adff2f';
        indication.style.color = 'black';
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
        desc.textContent = `Activity:${name.textContent} Duration: ${time.textContent}s`
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
            desc.style.color = "black";
        }
  
    });

    que.style.display = "block";
    que.textContent = "workout Selected";
    que.style.background = "#adff2f"
    setTimeout(() =>{
        que.style.display = "none"
    },3000);
};

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
            rest:element.querySelector(".rest-time").textContent,
            type: "premade",
            description: element.querySelector(".description").textContent
        }
        dataRemoved.push(updatedWorkoutServerData);
        console.log(dataRemoved);
        serve(dataRemoved);
    });

    if(updatedArray.length === 0){
        console.log("should be empty")
        dataRemoved.push([]);
        start.disabled = true;
        start.style.background = "none";
        start.style.color = "white";
        serve(dataRemoved);

        // allow user to customise workouts
        customiseButton.disabled = false;
        customiseButton.style.color = "";
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
    const customWorkoutDiv = document.createElement("div");
    customWorkoutDiv.className = "custom-workout";

    const customDesc = document.createElement("p");

    const selectedCustomRest = document.createElement("p")
    selectedCustomRest.className = "custom-rest";
    selectedCustomRest.style.display = "none";

    const customName = document.createElement("p")
    customName.className = "custom-name";
    customName.style.display = "none";

    const selectedCustomDuration = document.createElement("p")
    selectedCustomDuration.className = "custom-duration";
    selectedCustomDuration.style.display = "none";

    selectedWorkouts.append(customWorkoutDiv);
    selectedWorkoutArray.push(selectedWorkouts.querySelectorAll('.custom-workout'));
    const lastCustomElem = selectedWorkoutArray[selectedWorkoutArray.length - 1];
    console.log(lastCustomElem);

    //

    customDesc.textContent = `Workout-name:${customWorkout.value}, Duration:${customDuration.value}`
    customName.textContent = customWorkout.value;
    selectedCustomDuration.textContent = customDuration.value;
    selectedCustomRest.textContent = customRest.value;

    customWorkoutDiv.style.display = "flex";
    customWorkoutDiv.style.justifyContent = "space-around";
    customWorkoutDiv.style.background = "orange";
    customWorkoutDiv.style.padding = "10px";
    customWorkoutDiv.style.borderRadius = "10px";
    customWorkoutDiv.append(customDesc);
    customWorkoutDiv.append(customName);
    customWorkoutDiv.append(selectedCustomDuration);
    customWorkoutDiv.append(selectedCustomRest);
    customWorkoutDiv.append(removeCustomWorkouts);


    startHandler();
    let customDataExtract = [];
    
    lastCustomElem.forEach(element => {
        console.log(element)
        const customWorkoutData = {
            duration:element.querySelector(".custom-duration").textContent,
            name:element.querySelector(".custom-name").textContent,
            gif:"",
            rest:element.querySelector(".custom-rest").textContent,
            type: "custom"
        }
        customDataExtract.push(customWorkoutData);
        console.log(customDataExtract);
        serve(customDataExtract);
        if(customDataExtract.length != 0 ){
            selectionButtons.forEach((button) => {
                button.disabled = true;
                button.style.background = "grey";
                button.style.color = "white";
            })
        }
        
    })
    
    // append to selectedworkouts array

    removeCustomWorkouts.textContent = "X";
    removeCustomWorkouts.style.border = "none";
    removeCustomWorkouts.style.padding = "8px";
    removeCustomWorkouts.style.borderRadius = "8px";
    customDesc.style.padding = "8px";


    let lastCustomArray = []
    const removeCustomWorkoutsfunc = (event) => {
        const workoutDiv = event.target.parentElement;
       

        // remove from array
        // const parentElement = event.target.parentElement;
        let index = Array.from(workoutDiv.parentElement.children).indexOf(workoutDiv);
        console.log(index)
       
        lastCustomArray = selectedWorkoutArray[selectedWorkoutArray.length - 1];
        const updatedCustomArray = Array.from(lastCustomArray);
        workoutDiv.remove();
        updatedCustomArray.splice(index, 1);

        selectedWorkoutArray[selectedWorkoutArray.length - 1] = updatedCustomArray;
        console.log(updatedCustomArray)

        let customDataRemoved  = [];

        updatedCustomArray.forEach(element => {
            console.log(element)
            const updatedCustomData = {
                duration:element.querySelector(".custom-duration").textContent,
                name:element.querySelector(".custom-name").textContent,
                gif:"",
                rest:element.querySelector(".custom-rest").textContent,
                type: "custom",
            }
            customDataRemoved.push(updatedCustomData)
            console.log(customDataRemoved);
            serve(customDataRemoved);
        })

        if(updatedCustomArray.length == 0){
            customDataRemoved.push([]);
            start.disabled = true;
            start.style.background = "none";
            start.style.color = "white";

            selectionButtons.forEach((button) => {
                button.style.color = "black";
                button.style.background = "";
                button.disabled = false;
            })
            
            serve(customDataRemoved);
        };

    }
    
    removeCustomWorkouts.addEventListener('click', removeCustomWorkoutsfunc)
 
}
addCustomWorkout.addEventListener('click',logInput);


