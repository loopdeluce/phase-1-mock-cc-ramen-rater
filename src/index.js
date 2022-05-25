// write your code here

document.addEventListener('DOMContentLoaded', () => {
  getRamenMenu();
  addNewRamenEvent();
});

function getRamenMenu() {
  fetch('http://localhost:3000/ramens')
  .then(resp => resp.json())
  .then(data => data.forEach(dish => loadRamenPhoto(dish)))
};

function loadRamenPhoto(dish) {
  const image = dish.image;
  const id = dish.id;
  const name = dish.name;

  const menu = document.getElementById('ramen-menu')
  const img = document.createElement('img')

  img.src = image;
  img.dataset.num = id;
  img.alt = name;

  img.addEventListener('click', getRamenDetails)

  menu.append(img);
};

function getRamenDetails(event) {
  const ramenID = event.target.dataset.num;

  fetch(`http://localhost:3000/ramens/${ramenID}`)
  .then(resp => resp.json())
  .then(data => loadRamenDetails(data))
};

function loadRamenDetails(dish) {
  const {image, name, restaurant, rating, comment} = dish;

  const detailDiv = document.getElementById('ramen-detail');
  const img = detailDiv.querySelector('img');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');

  img.src = image;
  img.alt = name;
  detailDiv.querySelector('h2').textContent = name;
  detailDiv.querySelector('h3').textContent = restaurant;
  ratingDisplay.textContent = rating;
  commentDisplay.textContent = comment;
}

function addNewRamenEvent() {
  const form = document.getElementById('new-ramen');

  form.addEventListener('submit', createNewRamen);
}

function createNewRamen (event) {
  event.preventDefault();
  const newRamen = {
    name: event.target.name.value,
    restaurant: event.target.restaurant.value,
    image: event.target.image.value,
    rating: event.target.rating.value,
    comment: event.target['new-comment'].value
  }

  loadRamenPhoto(newRamen);
}