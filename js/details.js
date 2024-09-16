const detailsDiv = document.querySelector('#details'); // Contenedor donde se mostrarán los detalles
const movieDetailsDiv = document.querySelector('#movie-details'); // Contenedor para la imagen de fondo
const apiKey = 'e355b2b4334b7cdd0cda45a34c6256a4'; // Clave de API
const api = 'https://api.themoviedb.org/3/movie/'; // API base para detalles de películas
const apiImg = 'https://image.tmdb.org/t/p/original'; // API base para imágenes

// La función getQueryParam extrae el parámetro id de la URL.
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Busca el parámetro id en la cadena de consulta
const movieId = getQueryParam('id');

//!INVESTIGAR
// Función para agregar película a favoritos
function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites__list')) || [];
    if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        localStorage.setItem('favorites__list', JSON.stringify(favorites));
        alert('Película añadida a favoritos');
    } else {
        alert('Esta película ya está en tus favoritos');
    }
}

if (movieId) {
    // Obtener detalles de la película y el equipo de producción
    const url = `${api}${movieId}?api_key=${apiKey}&language=es-ES&append_to_response=credits`;

    fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json);

            const posterPath = json.poster_path ? `${apiImg}${json.poster_path}` : 'img/img-not-found.png';
            const backdropPath = json.backdrop_path ? `${apiImg}${json.backdrop_path}` : 'img/img-not-found.png';

            const director = json.credits.crew.find(person => person.job === 'Director');
            const directorName = director ? director.name : 'Director no disponible';

            // Guardar la película en el almacenamiento local usando el ID
            localStorage.setItem(`movie-${json.id}`, JSON.stringify(json));

            detailsDiv.innerHTML = `
                <article class="detailsCards">
                    <img src="${posterPath}" alt="Imagen de la película">
                    <h2>${json.title}</h2>
                    <p><strong>Fecha de lanzamiento:</strong> ${json.release_date}</p>
                    <p><strong>Resumen:</strong> ${json.overview}</p>
                    <p><strong>Director:</strong> ${directorName}</p>
                    <button onclick='handleAddToFavorites(${json.id})'>Añadir a Favoritos</button>
                </article>
            `;
            movieDetailsDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.656), rgba(0, 0, 0, 0.5)),url('${backdropPath}')`;
        })
        .catch(error => {
            console.log('Se encontró un error: ' + error);
        });
} else {
    detailsDiv.innerHTML = '<p>No se encontró el ID de la película.</p>';
}
//!INVESTIGAR
// Función para manejar el clic en el botón de agregar a favoritos
function handleAddToFavorites(movieId) {
    try {
        const movieData = localStorage.getItem(`movie-${movieId}`);
        if (movieData) {
            const movie = JSON.parse(movieData);
            addToFavorites(movie);
        } else {
            console.error('No se encontró la película en el almacenamiento local');
        }
    } catch (error) {
        console.error('Error al agregar la película a favoritos: ', error);
    }
}
