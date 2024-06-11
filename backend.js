const url = 'http://localhost:8000/api/v1/titles/?page_size=7&';

// Placeholder options for the fetch request
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

// Requête
const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error: ' + response.status);
  }
};

const handleError = (error) => {
  console.error(error);
};
let data;

const fetchData = async (url) => {
  try {
    const response = await fetch(url, options);
    const jsonData = await handleResponse(response);
    data = jsonData;
    return data
  } catch (error) {
    handleError(error);
  }
};

const run_test = async () => {
  let categories = document.querySelectorAll("h2")
  categories = Array.from(categories).filter(category => category.id !== "current_best");
  console.log(`typeof categorie in run_test: ${typeof categories}`)
  for (let categorie of categories) {
    if (categorie.id === 'best'){
      const fetchedData = await fetchData(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7`);
      console.log(fetchedData)
      const jsonData = JSON.stringify(fetchedData);
      console.log(jsonData)
      create_slider(jsonData, categorie);
      addEventListeners();
    }
    else{
      console.log(`http://localhost:8000/api/v1/titles/?genres=${categorie.id}&page_size=7`);
    const fetchedData = await fetchData(`http://localhost:8000/api/v1/titles/?genre=${categorie.id}&page_size=7`);
    console.log(`Ta grand mère la salope de merde: ${typeof fetchedData}`);
    console.log(fetchedData);
    const jsonData = JSON.stringify(fetchedData);
    console.log(jsonData);
    create_slider(jsonData, categorie);
    addEventListeners();
    };
  }
  
};

const run = async () => {
  const fetchedData = await fetchData('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7');
  const jsonData = JSON.stringify(fetchedData);
  create_slider( jsonData, 'best');
  addEventListeners();
};

const run_best = async () => {
  const fetchedData = await fetchData('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1');
  const jsonData = JSON.stringify(fetchedData);
  const movieObject = JSON.parse(jsonData); // parser la chaîne de caractères en objet JSON
  const movie_id = movieObject.results[0].id; // accéder à la propriété id de l'objet JSON
  const fetchedBest = await fetchData(`http://localhost:8000/api/v1/titles/${movie_id}`);
  const bestData = JSON.stringify(fetchedBest)
  const best_object = JSON.parse(bestData)
  best_movie(best_object)
};

const best_movie = async (movie) => {
  console.log(movie)
  // console.log(`movie id: ${movie_id}`);
  const best_section = document.getElementById('current_best')
  const div = document.createElement('div');
  div.classList.add('best_div');
  const title = document.createElement('h3');
  title.classList.add('best_title');
  const img = document.createElement('img');
  img.classList.add('best_img');
  const infos = document.createElement('p');
  infos.classList.add('best_infos')
  img.src = movie.image_url;
  title.innerText = movie.title;
  infos.innerText = (
    `Genres: ${movie.genres} \n` +
    `Année: ${movie.year} \n` +
    `Score IMDB: ${movie.imdb_score} \n` +
    `Réalisateurs: ${movie.directors} \n` +
    `Acteurs: ${movie.actors} \n` +
    `Durée: ${movie.duration}(min) \n` +
    `Résumé: ${movie.description} \n` +
    `Box-office mondial: ${movie.worldwide_gross_income} \n`)
  best_section.append(div);
  div.append(img);
  div.append(title);
  div.append(infos);
}

const categories = document.querySelectorAll('h2') 
console.log(`categories: ${categories}`)


// Génération de contenu
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function create_slide(movie){
  const slide = document.createElement('li')
  const title = document.createElement('p');
  title.classList.add('title')
  title.innerText = movie.title;
  title.setAttribute("title_id", `${movie.id}`)
  const imgDiv = document.createElement('div');
  imgDiv.classList.add('image_container')
  const img = document.createElement('img');
  img.classList.add('movie_image')
  img.src = movie.image_url
  imgDiv.appendChild(img)
  slide.appendChild(title)
  slide.appendChild(imgDiv)
  return slide
}

function build_modal(movie){
  const modalSection = document.createElement('section');
  const modalDiv = document.createElement('div');
  const closeBtn = document.createElement('button')
  const infosDiv = document.createElement('div');
  const modalTitle = document.createElement('h3');
  const modalInfos = document.createElement('p');
  modalSection.classList.add('modal');
  modalSection.classList.add('hidden');
  modalDiv.classList.add('hidden');
  modalDiv.classList.add('overlay');
  closeBtn.classList.add('btn-close');
  closeBtn.innerText = "X"
  modalDiv.style.backgroundImage = `url(${movie.image_url})`;
  modalTitle.innerText = movie.title;
  modalInfos.innerText = (
    `Genres: ${movie.genres} \n` +
    `Année: ${movie.year} \n` +
    `Score IMDB: ${movie.imdb_score} \n` +
    `Réalisateurs: ${movie.directors} \n` +
    `Acteurs: ${movie.actors} \n` +
    `Durée: ${movie.duration}(min) \n` +
    `Résumé: ${movie.description} \n` +
    `Box-office mondial: ${movie.worldwide_gross_income} \n`
  );

  modalSection.appendChild(modalDiv);
  modalSection.appendChild(closeBtn);
  modalDiv.appendChild(infosDiv)
  infosDiv.appendChild(modalTitle);
  infosDiv.appendChild(modalInfos);
  infosDiv.style.backgroundColor = 'white'


  closeBtn.addEventListener('click', function() {
    modalSection.remove();
  });
  return modalSection;
}

async function create_modal(movie_id){
  let movie_url = (`http://localhost:8000/api/v1/titles/${movie_id}`);
  console.log(`movie url ${movie_url}`)
  let movie = await fetchData(movie_url)
  let modal = build_modal(movie);
  document.body.appendChild(modal)
  return modal;
}

function create_slider(movies, categorie){
  let best = categorie
  switch (categorie) {
    case 'Drama':
      best = document.getElementById("Drama");
    case 'Biography':
      best = document.getElementById("Biography");
    case 'Crime':
      best = document.getElementById("Crime");
    case 'best':
      best = document.getElementById("best");
  }
  // const best = document.getElementById('best')
  const slider = document.createElement('div');
  const slides_list = document.createElement('ol')
  slider.classList.add('slider_container');
  const left_arrow = document.createElement('p');
  const right_arrow = document.createElement('p');
  left_arrow.classList.add('prev-btn');
  right_arrow.classList.add('next-btn');
  left_arrow.innerText = '<';
  right_arrow.innerText = '>';
  slider.appendChild(left_arrow);
  slider.appendChild(slides_list);
  slider.appendChild(right_arrow);
  let i = 0;
  const movies_list = JSON.parse(movies).results
  for (let movie of movies_list){
    i++;
    if (i < 8) {
      let slide = create_slide(movie);
      slides_list.appendChild(slide)
    }
    else{return}
  }
  insertAfter(best, slider)
}

// Get all carousels
function addEventListeners(){
  var carousels = document.querySelectorAll('.slider_container');

  carousels.forEach(function(carousel) {
    var slides = Array.from(carousel.querySelectorAll('li'));
    var index = [0,3];

      // Add event listeners to buttons
    var prevBtn = carousel.querySelector('.prev-btn');
    var nextBtn = carousel.querySelector('.next-btn');
    prevBtn.style.display = 'none';

    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);


    // Arrows
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    for (let i = index[0]; i <= index[1]; i++) {
      slides[i].style.display = 'block';
    }

    function nextSlide() {
      for (let i = index[0]; i <= index[1]; i++) {
        slides[i].style.display = 'none';
      }
    
      index[0] += 1;
      index[1] += 1;
    
      for (let i = index[0]; i <= index[1]; i++) {
        if (slides[i]) { // vérifier si l'élément existe
          slides[i].style.display = 'block';
        }
      }
    
      if (index[1] === slides.length - 1) {
        nextBtn.style.display = 'none';
      }
    
      if (index[0] !== 0) {
        prevBtn.style.display = 'block';
      }
    }

    function previousSlide() {
      for (let i = index[0]; i <= index[1]; i++) {
        slides[i].style.display = 'none';
      }
    
      index[0] -= 1;
      index[1] -= 1;
    
      for (let i = index[0]; i <= index[1]; i++) {
        if (slides[i]) { // vérifier si l'élément existe
          slides[i].style.display = 'block';
        }
      }
    
      if (index[0] === 0) {
        prevBtn.style.display = 'none';
      }
    
      if (index[1] !== slides.length - 1) {
        nextBtn.style.display = 'block';
      }
    }

    slides.forEach(function(slide) {
      slide.addEventListener('click', async function(title){
      let Title = slide.querySelector('p')
      movie_id = Title.getAttribute("title_id")
      await create_modal(movie_id)
      })
    })
  });
}

// run();
run_test();
run_best();