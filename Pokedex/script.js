import { PokemonAPI } from './webworker.js';

const gallery = document.getElementById('pokemon-gallery');
const generationFilter = document.getElementById('generation-filter');
const searchInput = document.getElementById('pokemon-search');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const uriImages = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

let currentPage = 1;
const limit = 42; //divisible entre 3 y 6(quedan bien als paginas)
let currentData = []; // Datos de la generación o filtro actual
let totalData = []; // Todos los datos cacheados
const pokemonAPI = new PokemonAPI();

// Mapeo de tipos de Pokémon a español y colores
const typeTranslations = {
    normal: { name: 'Normal', color: '#A8A77A' },
    fire: { name: 'Fuego', color: '#EE8130' },
    water: { name: 'Agua', color: '#6390F0' },
    electric: { name: 'Eléctrico', color: '#F7D02C' },
    grass: { name: 'Planta', color: '#7AC74C' },
    ice: { name: 'Hielo', color: '#96D9D6' },
    fighting: { name: 'Lucha', color: '#C22E28' },
    poison: { name: 'Veneno', color: '#A33EA1' },
    ground: { name: 'Tierra', color: '#E2BF65' },
    flying: { name: 'Volador', color: '#A98FF3' },
    psychic: { name: 'Psíquico', color: '#F95587' },
    bug: { name: 'Bicho', color: '#A6B91A' },
    rock: { name: 'Roca', color: '#B6A136' },
    ghost: { name: 'Fantasma', color: '#735797' },
    dragon: { name: 'Dragón', color: '#6F35FC' },
    dark: { name: 'Siniestro', color: '#705746' },
    steel: { name: 'Acero', color: '#B7B7CE' },
    fairy: { name: 'Hada', color: '#D685AD' }
};

// Cargar todas las generaciones y Pokémon al inicio
document.addEventListener('DOMContentLoaded', async () => {
    const storedData = localStorage.getItem('allPokemon');
    if (storedData) {
        totalData = JSON.parse(storedData);
        currentData = totalData;
        renderGallery(currentData);
        updatePaginationButtons(currentData.length);
    } else {
        await pokemonAPI.saveAllPokemonToLocalStorage();
        totalData = getAllPokemonFromLocalStorage();
        currentData = totalData;
        renderGallery(currentData);
        updatePaginationButtons(currentData.length);
    }
    const generations = await pokemonAPI.fetchGenerations();
    populateGenerationFilter(generations);
});

// Evento para el filtro de generación
generationFilter.addEventListener('change', async () => {
    const selectedGenerationURL = generationFilter.value;
    if (selectedGenerationURL === '') {
        loadAllPokemon(); // Mostrar todos los Pokémon
    } else {
        const pokemonNames = await pokemonAPI.fetchGenerationData(selectedGenerationURL);
        filterByNames(pokemonNames);
    }
});

// Evento para el buscador
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = currentData.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query)
    );
    currentPage = 1; // Restablecer a la primera página
    renderGallery(filtered);
    updatePaginationButtons(filtered.length);
});

// Eventos para la paginación
prevButton.addEventListener('click', () => changePage(-1));
nextButton.addEventListener('click', () => changePage(1));

// Evento para el botón de reinicio


// Rellenar el filtro de generaciones
function populateGenerationFilter(generations) {
    generationFilter.innerHTML = '<option value="">Todas las generaciones</option>';
    generations.forEach((generation, index) => {
        const option = document.createElement('option');
        option.value = generation.url;
        option.textContent = `Generación ${index + 1}`;
        generationFilter.appendChild(option);
    });
}

// Cargar todos los Pokémon
function loadAllPokemon() {
    totalData = getAllPokemonFromLocalStorage();
    currentData = totalData;
    currentPage = 1;
    renderGallery(currentData);
    updatePaginationButtons(currentData.length);
}

// Obtener todos los Pokémon desde localStorage
function getAllPokemonFromLocalStorage() {
    const allPokemon = [];
    for (let i = 1; i <= 1025; i++) {
        const pokemonData = localStorage.getItem(`pokemon_${i}`);
        if (pokemonData) {
            allPokemon.push(JSON.parse(pokemonData));
        }
    }
    localStorage.setItem('allPokemon', JSON.stringify(allPokemon));
    return allPokemon;
}

// Filtrar por nombres (generación seleccionada)
function filterByNames(names) {
    currentData = totalData.filter(pokemon => names.includes(pokemon.name));
    currentPage = 1; // Restablecer a la primera página
    renderGallery(currentData);
    updatePaginationButtons(currentData.length);
}

// Cambiar página
function changePage(direction) {
    currentPage += direction;
    renderGallery(currentData);
    updatePaginationButtons(currentData.length);
}

// Renderizar galería con paginación
function renderGallery(data) {
    gallery.innerHTML = '';
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const pageData = data.slice(startIndex, endIndex);
    pageData.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const img = document.createElement('img');
        img.classList.add('pokemon-img');
        img.src = uriImages + pokemon.id + '.png' || '';
        img.alt = pokemon.name;

        const name = document.createElement('p');
        name.textContent = pokemon.name;
        name.classList.add('pokemon-name'); 

        const numero = document.createElement('p');
        numero.textContent = '#' + pokemon.id;
        numero.classList.add('pokemon-number');

        const typesContainer = document.createElement('div');
        typesContainer.classList.add('pokemon-types-container');

        pokemon.types.forEach(typeInfo => {
            const type = typeInfo.name;
            const typeData = typeTranslations[type];
            if (typeData) {
                const typeElement = document.createElement('span');
                typeElement.textContent = typeData.name;
                typeElement.classList.add('pokemon-type');
                typeElement.style.backgroundColor = typeData.color;
                typesContainer.appendChild(typeElement);
            }
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(typesContainer);
        card.appendChild(numero);

        // Añadir evento de clic para redirigir a la página de detalles
        card.addEventListener('click', () => {
            window.location.href = `pokemonDinamic.html?id=${pokemon.id}`;
        });

        gallery.appendChild(card);
    });
}

// Actualizar botones de paginación
function updatePaginationButtons(totalItems) {
    const totalPages = Math.ceil(totalItems / limit);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}