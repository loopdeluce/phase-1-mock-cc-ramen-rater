// write your code here

document.addEventListener('DOMContentLoaded', () => {
  //const firstRamenId = {target: {dataset: {num: 1}}}

  getRamenMenu();
  //getRamenDetails(firstRamenId);
  addNewRamenEvent();
  addEditRamenEvent();
  addDeleteRamenEvent();
});

function getRamenMenu() {
  fetch('http://localhost:3000/ramens')
  .then(resp => resp.json())
  .then(data => {
    data.forEach(dish => loadRamenPhoto(dish))
    const firstChildID = data[0].id;
    const defaultRamen = {target: {dataset: {num: firstChildID}}}
    getRamenDetails(defaultRamen);
  })
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
  const {id, image, name, restaurant, rating, comment} = dish;

  const detailDiv = document.getElementById('ramen-detail');
  const img = detailDiv.querySelector('img');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');

  img.src = image;
  img.alt = name;
  img.dataset.num = id;
  detailDiv.querySelector('h2').textContent = name;
  detailDiv.querySelector('h3').textContent = restaurant;
  ratingDisplay.textContent = rating;
  commentDisplay.textContent = comment;
};

function addNewRamenEvent() {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', postNewRamen);
;}

function postNewRamen(event) {
  event.preventDefault();

  const newRamen = {
    'name': event.target.name.value,
    'restaurant': event.target.restaurant.value,
    'image': event.target.image.value,
    'rating': event.target.rating.value,
    'comment': event.target['new-comment'].value
  }

  fetch(`http://localhost:3000/ramens`, {
    method: 'POST',
    headers: {
      "content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newRamen)
  })
  .then(resp => resp.json())
  .then((data) => {
    const fullRamenData = Object.assign({}, data, newRamen)
    loadRamenPhoto(fullRamenData)
    const form = document.getElementById('new-ramen')
    form.reset();
  })
}

function addEditRamenEvent() {
  form = document.getElementById('edit-ramen')
  form.addEventListener('submit', patchRamen);
};

function patchRamen(event) {
  event.preventDefault();

  const ramenTarget = document.querySelector('#ramen-detail .detail-image')
  const ramenID = ramenTarget.dataset.num

  const newRating = event.target.rating.value;
  const newComment = event.target['new-comment'].value;
  const patch = {rating: newRating, comment: newComment}

  fetch(`http://localhost:3000/ramens/${ramenID}`, {
    method: 'PATCH',
    headers: {
      "content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(patch)
  })
  .then(resp => resp.json())
  .then(data => editRamen(data))
}

function editRamen(ramen) {

  const newRating = ramen.rating;
  const newComment = ramen.comment;

  const existingRating = document.getElementById('rating-display');
  const existingComment = document.getElementById('comment-display');

  existingRating.textContent = newRating;
  existingComment.textContent = newComment;

  document.getElementById('edit-ramen').reset();
};

function addDeleteRamenEvent(){
  const deleteButton = document.getElementById('delete');
  deleteButton.addEventListener('click', deleteRamenData);
}

function deleteRamenData(event) {
  const ramenDisplay = document.querySelector('#ramen-detail .detail-image');
  const ramenDisplayId = ramenDisplay.dataset.num;

  fetch(`http://localhost:3000/ramens/${ramenDisplayId}`, {
    method: 'DELETE',
    headers: {
      "content-type": "application/json",
      "Accept": "application/json"
    },
  }
  )
  .then(resp => resp.json())
  .then(deleteRamen())

}

function deleteRamen(){
  const ramenDisplay = document.querySelector('#ramen-detail .detail-image');
  const ramenDisplayId = ramenDisplay.dataset.num;

  const ramenMenuArray = Array.from(document.getElementById('ramen-menu').children);
  const ramenToRemove = ramenMenuArray.find((ramen) => ramen.dataset.num === ramenDisplayId);

  ramenToRemove.remove();  

  const newRamenMenuArray = Array.from(document.getElementById('ramen-menu').children);
  const firstChildID = newRamenMenuArray[0].dataset.num
  const defaultRamen = {target: {dataset: {num: firstChildID}}}
  getRamenDetails(defaultRamen);
};