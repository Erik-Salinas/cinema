//Utilizar DOMContentLoaded garantiza que el código JavaScript que manipula el DOM se ejecute solo después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
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

    // Función para actualizar el ícono de favorito
    function updateFavoriteIcon(isFavorite) {
        const favoriteIcon = document.querySelector('#favoriteIcon'); // Selecciona el icono aquí
        if (favoriteIcon) { // Verifica si favoriteIcon no es null
            if (isFavorite) {
                favoriteIcon.classList.remove('inactive');
                favoriteIcon.classList.add('active');
            } else {
                favoriteIcon.classList.remove('active');
                favoriteIcon.classList.add('inactive');
            }
        }
    }

    // Función para agregar película favoritas o eliminar película de favoritos
    function addToFavorites(movie) {
        let favorites = JSON.parse(localStorage.getItem('favorites__list')) || [];
        const isFavorite = favorites.some(fav => fav.id === movie.id);
        let inputAlert = document.querySelector('#detailsAlert');
        
        if (!isFavorite) {
            favorites.push(movie);
            localStorage.setItem('favorites__list', JSON.stringify(favorites));
            inputAlert.innerHTML = `<div class="movie__alert"><p class="cinema__alert--true">Película añadida a favoritos</p></div>`; 
        } else {
            favorites = favorites.filter(fav => fav.id !== movie.id);
            localStorage.setItem('favorites__list', JSON.stringify(favorites));
            inputAlert.innerHTML = `<div class="cinema__alert"><p class="cinema__alert--false">Película eliminada de favoritos</p></div>`; 
        }
        
        // Actualizar el ícono después de agregar o eliminar
        updateFavoriteIcon(!isFavorite);
    
        setTimeout(() => {
            inputAlert.innerHTML = '';
        }, 2500); // Puedes ajustar el tiempo según lo necesites
    }
    

    if (movieId) {
        // Obtener detalles de la película, idioma y el equipo de producción
        const url = `${api}${movieId}?api_key=${apiKey}&language=es-ES&append_to_response=credits`;

        fetch(url)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                const posterPath = json.poster_path ? `${apiImg}${json.poster_path}` : '../img/img-not-found.png';
                const backdropPath = json.backdrop_path ? `${apiImg}${json.backdrop_path}` : '../img/img-not-found.png';

                const director = json.credits.crew.find(person => person.job === 'Director');
                const directorName = director ? director.name : 'Director no disponible';

                // Guardar la película en el almacenamiento local usando el ID
                localStorage.setItem(`movie-${json.id}`, JSON.stringify(json));

                detailsDiv.innerHTML = `
                    <article class="details__cards">
                        <img class="details__img" src="${posterPath}" alt="${json.title}">
                        <button class="details__btn" id="addToFavoritesButton">
                            <svg id="favoriteIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="inactive">
                                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                            </svg>
                        </button>
                        <p class="details__text"><strong>Lanzamiento</strong> ${json.release_date}</p>
                        <p class="details__text"><strong>Vista general</strong> ${json.overview}</p>
                        <p class="details__text"><strong>Director</strong> ${directorName}</p>
                    </article>
                `;
                movieDetailsDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.656), rgba(0, 0, 0, 0.5)),url('${backdropPath}')`;

                // Verificar si la película está en favoritos al cargar la página
                const favorites = JSON.parse(localStorage.getItem('favorites__list')) || [];
                updateFavoriteIcon(favorites.some(fav => fav.id === json.id));
            })
            .catch(error => {
                console.log('Se encontró un error: ' + error);
            });
    } else {
        detailsDiv.innerHTML = '<p>No se encontró el ID de la película.</p>';
    }

    //!INVESTIGAR
// Función para manejar el clic en el botón de agregar a favoritos
    document.addEventListener('click', (event) => {
        if (event.target.closest('#addToFavoritesButton')) {
            handleAddToFavorites(movieId);
        }
    });

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
});
