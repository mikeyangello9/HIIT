// get the input value and send to the server as a payload when the add user button is pressed
const userInput = document.querySelector('.username');
const adduserButton = document.querySelector('.adduser-button');
const loginButton = document.querySelector('.login-button');
const warning = document.querySelector('.warning');

// prepare payload

const servePayload = (userEnteredName) => {
  console.log(userEnteredName);
  const options = {
    method: 'POST',
    body: JSON.stringify({ name: userEnteredName }),
    headers: {
      'Content-Type': 'application/json',
    },
  };


  fetch('/addUser', options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('response was not ok!');
      }

      if (response.status === 204) {
        throw new Error('response is empty');
      }
      return response.text();
    }).then(data => {
      console.log(`server response: ${data}`);
      const response = JSON.parse(data);
      console.log(response.message);
      adduserButton.disabled = false;
      adduserButton.style.background = 'black';
      warning.style.display = 'block';
      warning.textContent = response.message;
    }).catch(error => console.error(`something has gone awry: ${error}`));
};

async function checkUser() {
  const response = await fetch('/addUser');
  const json = await response.json();
  for (let i = 0; i < json.data.length; i++) {
    if (userInput.value === json.data[i].user_name) {
      console.log('logged in');
      warning.style.display = 'none';
      window.location.href = '/userarea.html?username=' + encodeURIComponent(userInput.value);
      return; // Exit the loop after successful login
    } else {
      warning.style.display = 'block';
      warning.textContent = 'username does not exist';
    }
  }
}


const addUser = () => {
  if (userInput.value === '') {
    warning.style.display = 'block';
  } else {
    servePayload(userInput.value);
    console.log(userInput.value);
    warning.style.display = 'none';
    adduserButton.disabled = true;
    userInput.value = '';
    adduserButton.style.background = 'grey';
  }
};


const loginUser = () => {
  console.log('test');
  checkUser();
};

adduserButton.addEventListener('click', addUser);
loginButton.addEventListener('click', loginUser);
