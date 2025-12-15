import { PokemonAPI } from './webworker.js';

const pokemonAPI = new PokemonAPI();
const detailsContainer = document.getElementById('pokemon-details');
const uriImages = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const uriSprites = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// Obtener el ID del Pokémon de la URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');
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
document.addEventListener('DOMContentLoaded', async () => {
    if (pokemonId) {
        const pokemonData = await fetchPokemonFromLocalStorage(pokemonId);
        if (pokemonData) {
            renderPokemonDetails(pokemonData);
        } else {
            const pokemon = await pokemonAPI.fetchPokemon(pokemonId);
            renderPokemonDetails(pokemon);
        }
    }
});

function fetchPokemonFromLocalStorage(id) {
    const pokemonData = localStorage.getItem(`pokemon_${id}`);
    return pokemonData ? JSON.parse(pokemonData) : null;
}

function renderPokemonDetails(pokemon) {
    let titulo = document.getElementById('header-title');
    titulo.textContent = pokemon.name;
    detailsContainer.innerHTML = `
        <img src="${uriImages}${pokemon.id}.png" alt="${pokemon.name}">
        <p>ID: #${pokemon.id}</p>
        <p>Altura: ${pokemon.height} dm</p>
        <p>Peso: ${pokemon.weight} hg</p>
        <div class="pokemon-types-container">
            ${pokemon.types.map(typeInfo => {
                const typeData = typeTranslations[typeInfo.name];
                return `<span class="pokemon-type" style="background-color: ${typeData.color};">${typeData.name}</span>`;
            }).join('')}
        </div>
        <h2>Habilidades</h2>
        <ul>
            ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join('')}
        </ul>
        <h2>Estadísticas</h2>
        <ul>
            ${pokemon.stats.map(stat => `<li>${stat.name}: ${stat.value}</li>`).join('')}
        </ul>
        <h2>Imágenes y Sprites</h2>
        <div class="pokemon-sprites">
            <img src="${uriSprites}${pokemon.id}.png" alt="${pokemon.name} sprite">
            <img src="${uriSprites}back/${pokemon.id}.png" alt="${pokemon.name} back sprite">
            <img src="${uriSprites}shiny/${pokemon.id}.png" alt="${pokemon.name} shiny sprite">
            <img src="${uriSprites}back/shiny/${pokemon.id}.png" alt="${pokemon.name} back shiny sprite">
        </div>
        <h2>Tabla de Daños</h2>
        <div class="damage-table">
            <div class="damage-row header">
                <div class="damage-cell">Tipo</div>
                <div class="damage-cell">Daño a</div>
                <div class="damage-cell">Débil contra</div>
            </div>
            ${pokemon.types.map(typeInfo => {
                const typeData = typeTranslations[typeInfo.name];
                return `
                    <div class="damage-row">
                        <div class="damage-cell" style="background-color: ${typeData.color};">${typeData.name}</div>
                        <div class="damage-cell">${getDamageTo(typeInfo.name)}</div>
                        <div class="damage-cell">${getWeakAgainst(typeInfo.name)}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getDamageTo(type) {
    const damageTo = {
        fire: ['grass', 'ice', 'bug', 'steel'],
        water: ['fire', 'ground', 'rock'],
        electric: ['water', 'flying'],
        grass: ['water', 'ground', 'rock'],
        ice: ['grass', 'ground', 'flying', 'dragon'],
        fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
        poison: ['grass', 'fairy'],
        ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
        flying: ['grass', 'fighting', 'bug'],
        psychic: ['fighting', 'poison'],
        bug: ['grass', 'psychic', 'dark'],
        rock: ['fire', 'ice', 'flying', 'bug'],
        ghost: ['psychic', 'ghost'],
        dragon: ['dragon'],
        dark: ['psychic', 'ghost'],
        steel: ['ice', 'rock', 'fairy'],
        fairy: ['fighting', 'dragon', 'dark'],
        
    };
    return damageTo[type] ? damageTo[type].join(', ') : 'N/A';
}

function getWeakAgainst(type) {
    const weakAgainst = {
        fire: ['Water', 'Rock', 'Fire'],
        water: ['Electric', 'Grass'],

        // Añadir más tipos según sea necesario
    };
    return weakAgainst[type] ? weakAgainst[type].join(', ') : 'N/A';
}

// function traducirTipo(type){
//     return typeTranslations[type].name;
// }