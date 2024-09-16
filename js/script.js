const searchForm =document.querySelector('#searchForm'); //Formulario
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
        favoritesDiv.innerHTML += `
            <div class="favorite-card">
                <a href="pages/movie.html?id=${movie.id}">
                    <img src="${apiImg}${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                </a>
                <button onclick="removeFromFavorites(${movie.id})">Eliminar de Favoritos</button>
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

    if (!inputSearch) {
        window.alert('Ingrese un nombre de pelicula');
        return;
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
                padre.classList.add('cards');
                let link = document.createElement('a');
                link.href = `pages/movie.html?id=${element.id}`
                 // Verifica si hay una imagen de cartelera disponible
                 //Operador Ternario                                    verdadero                 falso
                const posterPath = element.poster_path ? `${apiImg}${element.poster_path}` : 'img/img-not-found.png'; // Reemplaza con la URL de la imagen predeterminada

                link.innerHTML += `
                <img class="img" src="${posterPath}" alt="Imagen de la película">
                <h2 class="title">${element.title}</h2>
                <p class="year">${element.release_date}</p>
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
