// countdown
const countDown = document.querySelector('.countdown-display');
const values = ['3', '2', '1', 'GO'];
let index = 0;

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const userId = urlParams.get('id');

console.log(`username:${username}, user id: ${userId} `);

const countdownfunc = (countdownItems, element) => {
  const countdownInterval = setInterval(() => {
    if (index < countdownItems.length) {
      countDown.textContent = countdownItems[index]; // update the value of index if it's value is less than the array length
      index++;
    } else {
      clearInterval(countdownInterval);
      element.style.display = 'none';
    }
  }, 1000);
};


countdownfunc(values, countDown);


const instance = document.querySelector('.workout-instance');
const nextWorkout = document.querySelector('.next-workout');
const workoutsLeft = document.querySelector('.workouts-left');


instance.style.display = 'none';
nextWorkout.style.display = 'none';
workoutsLeft.style.display = 'none';

setTimeout(() => {
  instance.style.display = 'block';
  const gif = document.querySelector('.gif-start');

  const pauseButton = document.querySelector('.pause-button');
  const resumeButton = document.querySelector('.resume-button');
  const workoutName = document.querySelector('.workout-name');
  const duration = document.querySelector('.duration');
  //   const rest = document.querySelector('.rest-time');

  let elapsedtime = 0;
  let currentTime = 0;
  let remainingTime = 0;
  let startTime = new Date().getTime();
  let restTime = 0;

  let currentWorkoutIndex = 0;
  let intervalID;

  let workoutTrack;
  let gifTrack;

  const workoutEnd = document.querySelector('.workout-end');
  const congratulatoryHeader = document.querySelector('.big-header');
  const usedTime = document.querySelector('.used-time');
  const workoutCount = document.querySelector('.workout-count');
  const time = document.querySelector('.time');
  const totalArray = [];

  const restIncluded = [];
  const gifArray = [];
  const restArray = [];
  const imageArray = [];

  const informUser = document.querySelector('.inform-user');
  const durationHistory = [];
  const workoutHistory = [];
  const restHistory = [];
  const typeHistory = [];

  // alert user that work is about to start

  fetch('/workout').then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    console.log(response);
    return response.json();
  }).then((data) => {
    const format = JSON.stringify(data);
    console.log(`response from server: ${format}`);
    console.log(parseInt(data.workout[currentWorkoutIndex].duration));
    console.log(data.workout.length);

    data.workout.map((elem) => {
      return totalArray.push(parseInt(elem.duration));
    });
    const totalDuration = totalArray.reduce((acc, cur) => acc + cur, 0);
    console.log(totalDuration);

    for (let i = 0; i < data.workout.length; i++) {
      restIncluded.push(data.workout[i].duration);
      restArray.push(data.workout[i].name);
      gifArray.push(data.workout[i].gif);
      imageArray.push(data.workout[i].image);
      if (i !== data.workout.length - 1) {
        restIncluded.push(data.workout[i].rest);
        restArray.push('REST');
        gifArray.push('./gifs/resting.gif');
        imageArray.push('./images/restingimage.jpg');
      }
      // history data
      durationHistory.push(data.workout[i].duration);
      workoutHistory.push(data.workout[i].name);
      restHistory.push(data.workout[i].rest);
      typeHistory.push(data.workout[i].type);
    }
    console.log(restIncluded);
    console.log(gifArray);
    console.log(restArray);
    console.log(imageArray);
    // show next workout

    // use one instance

    const updateTimer = () => {
      currentTime = new Date().getTime();

      elapsedtime = Math.floor((currentTime - startTime) / 1000); // milliseconds


      remainingTime = parseInt(restIncluded[currentWorkoutIndex]) - elapsedtime;


      console.log(remainingTime);

      if (currentWorkoutIndex % 2 === 1) {
        workoutTrack = restArray[currentWorkoutIndex];
        gifTrack = gifArray[currentWorkoutIndex];
        restTime = restIncluded[currentWorkoutIndex];
        console.log('check');
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'none';
        workoutsLeft.style.display = 'none';
      } else if (currentWorkoutIndex % 2 === 0) {
        workoutTrack = restArray[currentWorkoutIndex];
        gifTrack = gifArray[currentWorkoutIndex];
        restTime = restIncluded[currentWorkoutIndex];
        pauseButton.style.display = 'block';
        resumeButton.style.display = 'block';
      }


      if (remainingTime <= 0) {
        clearInterval(intervalID);
        console.log('time exhausted');


        currentWorkoutIndex++;
        console.log(currentWorkoutIndex);
        if (currentWorkoutIndex < restIncluded.length) {
          startNextWorkout();

          // workout rest alternation
        } else {
          pauseButton.disabled = true;
          resumeButton.disabled = true;
          instance.remove();
          nextWorkout.remove();
          workoutsLeft.remove();


          usedTime.textContent = `${totalDuration}s was spent!`;
          workoutCount.textContent = `${data.workout.length} workout(s) were completed!`;
          congratulatoryHeader.style.display = 'block';
          workoutEnd.style.display = 'flex';
          workoutEnd.style.justifyContent = 'space-around';

          // after workout end send a post req to server and save the completed workout to the history table in the database

          console.log(`history data${durationHistory}, ${workoutHistory}`);
          let historyData;

          const dateNow = new Date();
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayOfWeek = daysOfWeek[dateNow.getDay()];
          const time = dateNow.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
          const dateOfWorkout = `${dayOfWeek} ${time}`;

          const serve = (userSelection) => {
            const options = {
              method: 'POST',
              body: JSON.stringify(userSelection),
              headers: {
                'Content-Type': 'application/json',
              },
            };


            fetch('/completedWorkoutData', options)
              .then((response) => {
                if (!response.ok) {
                  throw new Error('response was not ok!');
                }

                if (response.status === 204) {
                  throw new Error('response is empty');
                }
                return response.json();
              }).then(data => {
                console.log(`server response ${data}`);
              }).catch(error => console.error(`something has gone awry: ${error}`));
          };
          for (let i = 0; i < workoutHistory.length; i++) {
            historyData = {
              userID: userId,
              name: workoutHistory[i],
              duration: `${durationHistory[i]}s`,
              rest: `${restHistory[i]}s`,
              date: dateOfWorkout,
            };
            serve(historyData);
          }

          // serve(parsedData);
        }
      }

      duration.textContent = remainingTime;
      gif.src = gifTrack;
      workoutName.textContent = workoutTrack;

      nextWorkout.style.display = 'block';
      workoutsLeft.style.display = 'block';
      if (currentWorkoutIndex + 1 < restArray.length) {
        nextWorkout.textContent = `UPNEXT: ${restArray[currentWorkoutIndex + 1]}`;
        workoutsLeft.textContent = `${currentWorkoutIndex + 1} / ${data.workout.length}`;
        workoutsLeft.style.textAlign = 'center';
      } else {
        nextWorkout.textContent = 'Last workout, You\'ve Got this';
        informUser.textContent = `Getting to the finish line in ${remainingTime}`;
      }

      // inform user of change

      if (remainingTime <= 5) {
        time.style.color = 'red';
        informUser.style.display = 'block';
        informUser.textContent = `GET READY TO CHANGE IN ${remainingTime}`;
      } else {
        time.style.color = 'black';
        instance.style.border = 'none';
        informUser.style.display = 'none';
      }

      if (remainingTime === 0) {
        informUser.style.display = 'none';
      }
    };


    const startNextWorkout = () => {
      startTime = new Date().getTime();
      elapsedtime = 0;
      intervalID = setInterval(updateTimer, 1000);
    };

    startNextWorkout();


    // buttons
    resumeButton.addEventListener('click', () => {
      startTime = new Date().getTime() - elapsedtime * 1000;
      console.log(startTime);
      intervalID = setInterval(updateTimer, 1000);
      pauseButton.disabled = false;
    });

    pauseButton.addEventListener('click', () => {
      resumeButton.disabled = false;
      currentTime = new Date().getTime();
      clearInterval(intervalID);
      elapsedtime = Math.floor((currentTime - startTime) / 1000);
      console.log(elapsedtime);
      pauseButton.disabled = true;
    });


    // newline
  }).catch((err) => {
    console.error('error');
    console.log(err);
  });


  window.addEventListener('beforeunload', (e) => {
    console.log('Going somewhere?');
    e.preventDefault();
  });
}, 5000);
