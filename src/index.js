let addToy = false;

//variables for DOM nodes 
let toyCollection = document.querySelector('#toy-collection'); 
let form = document.querySelector('.add-toy-form');

//this listener came pre-written and toggles display of the form 
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Render toy data and images to cards in the DOM 
function renderToys () {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(obj => {
      toyCollection.innerHTML="";
      for (let toy of obj){
        let card = document.createElement('div')
        card.setAttribute('class', 'card')
        card.innerHTML = `<h2> ${toy.name} </h2> <img src=${toy.image} class="toy-avatar" /> 
          <p> ${toy.likes} Likes</p>  <button class="like-btn" id=${toy.id}>Like</button>`; 
        toyCollection.appendChild(card); 
        //add event listener to each like button
        let likeBtn = document.getElementById(toy.id);
        function handleLike () {
          let newLikes = toy.likes + 1;
          //send likes to server
          fetch(`http://localhost:3000/toys/${toy.id}`, {
            method: 'PATCH', 
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({'likes': newLikes})
          })
          .then( resp => resp.json())
          .then((data) => {
            card.innerHTML = `<h2> ${toy.name} </h2> <img src=${toy.image} class="toy-avatar" /> 
            <p> ${data.likes} Likes</p>  <button class="like-btn" id=${toy.id} disabled>Liked!</button>`;            
          });
        }
        
        likeBtn.removeEventListener('click', handleLike);
        likeBtn.addEventListener('click', handleLike);


          
      }
      return obj;
    })
}

//Submit a new toy via the form
function newToyHandler(event) {
  event.preventDefault(); 
  let inputs = document.querySelectorAll('.input-text');
  let toyName = inputs[0].value;
  let imgUrl = inputs[1].value; 
  let fetchObj = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toyName,
      "image": imgUrl,
      "likes": 0
    })
  }
  fetch('http://localhost:3000/toys', fetchObj)
    .then(resp => resp.json)
    .then( () => {
      //clear the inputs and re-render the DOM with new toy   
      inputs[0].value = "";
      inputs[1].value = ""; 
      toyCollection.innerHTML = ""; 
      renderToys(); 
    })
}


// Event Listeners 
document.addEventListener('DOMContentLoaded', renderToys)
form.addEventListener('submit', newToyHandler)
