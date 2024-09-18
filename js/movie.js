
const searchForm = document.querySelector('#searchForm'); //Formulario
const btnSearch = document.querySelector('#btnSearch'); //boton
const pelicula = document.querySelector('#pelicula');//Contenedor
const favoritesDiv = document.querySelector('#favorites__list'); // Contenedor para las películas favoritas
const apiKey = 'e355b2b4334b7cdd0cda45a34c6256a4';  //Clave de api
const api = 'https://api.themoviedb.org/3/search/movie'; //Api peliculas
const apiImg = 'https://image.tmdb.org/t/p/original';//api imagenes

//!INVESTIGAR
// Función para mostrar las películas favoritas
function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites__list')) || [];
    favoritesDiv.innerHTML = '';
    favorites.forEach(movie => {
        const posterPath = movie.poster_path ? `${apiImg}${movie.poster_path}` : 'img/img-not-found.png';
        favoritesDiv.innerHTML += `
            <div class="favorite__cards">
                <a class="favorite__link" href="pages/view-movie.html?id=${movie.id}">
                    <img class="favorite__img" src="${posterPath }" alt="${movie.title}">
                    <h2 class="favorite__title">${movie.title}</h2>
                    <p class="movie__year">${movie.release_date}</p>
                </a>
                <button class="favorite__btn" onclick="removeFromFavorites(${movie.id})"><svg viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                </button>
            </div>
        `;
    });
}
//!INVESTIGAR
// Función para eliminar película de favoritos
function removeFromFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites__list')) || [];
    favorites = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem('favorites__list', JSON.stringify(favorites));
    loadFavorites(); // Actualiza la lista de favoritos
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let inputSearch = document.querySelector('#search').value;
    let inputAlert= document.querySelector('#searchAlert');

    if (!inputSearch) {
        /* window.alert('Ingrese un nombre de pelicula');
        return; */
        inputAlert.innerHTML = `<div class="cinema__alert"><p class="cinema__alert--false">Ingrese un nombre de pelicula</p></div> `; 
        return;
    }
    else{
        inputAlert.innerHTML = ' ';
    }

    // Construye la URL de solicitud con el término de búsqueda y el idioma en español
    const url = `${api}?api_key=${apiKey}&query=${encodeURIComponent(inputSearch)}&language=es-ES`;

    //Inicia una solicitud a la API.
    fetch(url)
        //Procesa la respuesta cuando se resuelve la promesa
        .then(response => response.json())
        //Utiliza los datos obtenidos de la respuesta
        .then(json => {
            console.log(json)
            pelicula.innerHTML = ' ' //Limpiamos contenedor padre

            if (json.results.length === 0) {
                pelicula.innerHTML = '<p>No se encontraron resultados.</p>'; // Mensaje cuando no hay resultados
                return;
            }

            for (let i = 0; i < 20; i++) {
                const element = json.results[i];
                let padre = document.createElement('article');
                padre.classList.add('movie__cards');
                let link = document.createElement('a');
                link.href = `pages/view-movie.html?id=${element.id}`
                // Verifica si hay una imagen de cartelera disponible
                //Operador Ternario                                    verdadero                 falso
                const posterPath = element.poster_path ? `${apiImg}${element.poster_path}` : 'img/img-not-found.png'; // Reemplaza con la URL de la imagen predeterminada

                link.innerHTML += `
                <img class="movie__img" src="${posterPath}" alt="${element.title}">
                <h2 class="movie__title">${element.title}</h2>
                <p class="movie__year">${element.release_date}</p>
                `

                padre.appendChild(link);
                pelicula.appendChild(padre);
            }
        })
        //Maneja cualquier error que ocurra durante la solicitud o el procesamiento.
        .catch(error => {
            console.log('Se encontro un error' + error);
        })
        //Ejecuta el código dentro de esta función al final, independientemente de si la promesa fue resuelta con éxito o rechazada.
        .finally(() => {
            // Limpia el campo de búsqueda después de que la búsqueda se haya realizado
            inputSearch = document.querySelector('#search').value = '';
        });
});
// Manejar el evento de clic en el botón de búsqueda
btnSearch.addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'));
});

// Cargar favoritos al iniciar la página
window.onload = loadFavorites;
