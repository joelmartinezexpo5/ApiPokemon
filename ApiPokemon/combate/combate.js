const pokeAPI = 'https://pokeapi.co/api/v2/';
const pokemonList = JSON.parse(localStorage.getItem('pokemons')) || [];

let selectedPokemon = null;
let enemyPokemon = null;

// Inicializa el juego
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('select-player-pokemon').addEventListener('click', () => mostrarSeleccionPokemon(false));
    document.getElementById('select-enemy-pokemon').addEventListener('click', () => mostrarSeleccionPokemon(true));
    document.getElementById('reset-selection').addEventListener('click', reiniciarSelecciones);
    document.getElementById('start-battle').addEventListener('click', iniciarBatalla);
});

const ventanaEmergente = document.getElementById('ventanaEmergente');
const listaPokemon = document.getElementById('listaPokemon');
const cerrarVentanaEmergenteBtn = document.getElementById('cerrarVentanaEmergente');
const paginadorAnterior = document.getElementById('anterior');
const paginadorSiguiente = document.getElementById('siguiente');
const buscadorPokemon = document.getElementById('buscador-pokemon');

function reiniciarSelecciones() {
    selectedPokemon = null;
    enemyPokemon = null;

    document.getElementById('player-name').textContent = 'Ningún Pokémon seleccionado';
    document.getElementById('enemy-name').textContent = 'Ningún Pokémon seleccionado';
    document.getElementById('player-image').style.display = 'none';
    document.getElementById('enemy-image').style.display = 'none';

    
}

cerrarVentanaEmergenteBtn.addEventListener('click', () => ventanaEmergente.classList.add('hidden'));

let paginaActual = 1;
let totalPokemons = 0;
let todosLosPokemon = [];
const limitePorPagina = 20;

// async function cargarPokemon(pagina) {
//   const generacion = filtroGeneracion.value; // Obtener la generación seleccionada
//   console.log('Generación seleccionada:', generacion);
//   listaPokemon.innerHTML = ''; // Limpiar la lista de Pokémon

//   let pokemonData = [];
//   const todosLosPokemon = JSON.parse(localStorage.getItem('pokemons')) || [];

//   pokemonData = todosLosPokemon.slice((pagina - 1) * limitePorPagina, pagina * limitePorPagina);
//   totalPokemons = todosLosPokemon.length;

//   // Mostrar tarjetas de Pokémon
//   for (const pokemon of pokemonData) {
//     const tarjeta = document.createElement('div');
//     tarjeta.classList.add('tarjeta-pokemon');
//     tarjeta.innerHTML = ` 
//       <img src="${uriSprites.uri}${pokemon.id}${uriSprites.ext}" alt="${pokemon.name}">
//       <h4>${pokemon.name}</h4>
//     `;
//     tarjeta.onclick = () => seleccionarPokemon(detalles);
//     listaPokemon.appendChild(tarjeta);
//   }

//   // Configurar botones de paginación
//   paginadorAnterior.disabled = pagina === 1;
//   paginadorSiguiente.disabled = pagina * limitePorPagina >= totalPokemons;
// }

async function mostrarSeleccionPokemon(esEnemigo) {
    const modal = document.createElement('div');
    modal.className = 'pokemon-modal';
    
    const grid = document.createElement('div');
    grid.className = 'pokemon-grid';

    for (const pokemon of pokemonList) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;

        card.addEventListener('click', () => {
            seleccionarPokemon(pokemon.name, esEnemigo);
            modal.remove();
        });

        grid.appendChild(card);
    }

    modal.appendChild(grid);
    document.body.appendChild(modal);
}

async function obtenerPokemon(nombrePokemon) {
    const response = await fetch(`${pokeAPI}pokemon/${nombrePokemon.toLowerCase()}`);
    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat,
        type: data.types[0].type.name
    };
}

async function seleccionarPokemon(pokemon, esEnemigo) {
    let data = await obtenerPokemon(pokemon);
    if (esEnemigo) {
        enemyPokemon = data;
        actualizarUIPokemon(enemyPokemon, 'enemy');
        document.getElementById('start-battle').style.display = 'block';
    } else {
        selectedPokemon = data;
        actualizarUIPokemon(selectedPokemon, 'player');
        document.getElementById('select-enemy-pokemon').disabled = false;
    }

    document.getElementById('reset-selection').disabled = false;
}

function actualizarUIPokemon(pokemon, idElemento) {
    // Actualiza el nombre del Pokémon
    document.getElementById(`${idElemento}-name`).textContent = pokemon.name;

    // Actualiza la imagen del Pokémon
    const image = document.getElementById(`${idElemento}-image`);
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    image.style.display = 'block'; // Asegúrate de que la imagen esté visible

    // Actualiza la barra de HP
    const barraHp = document.getElementById(`${idElemento}-hp`).querySelector('.hp-bar');
    barraHp.style.width = '100%'; // Establece la barra a 100% al inicio
}


function calcularDanio(atacante, defensor) {
    const factorAleatorio = Math.random() * 10;
    let danio = Math.round((atacante.attack + factorAleatorio) - defensor.defense); // Redondeo a número entero
    
    // Tabla de multiplicadores de daño según los tipos
    const efectividadTipos = {
        'normal': { 'rock': 2, 'ghost': 0, 'steel': 0.5 },
        'fire': { 'grass': 2, 'fire': 0.5, 'water': 0.5, 'rock': 2, 'bug': 2, 'ghost': 1 },
        'water': { 'fire': 2, 'water': 0.5, 'electric': 2, 'grass': 0.5, 'ghost': 1 },
        'electric': { 'water': 2, 'electric': 0.5, 'ground': 0, 'flying': 2, 'ghost': 1 },
        'grass': { 'water': 2, 'fire': 0.5, 'grass': 0.5, 'bug': 2, 'flying': 0.5, 'ghost': 1 },
        'ice': { 'fire': 0.5, 'water': 0.5, 'ice': 0.5, 'steel': 2, 'ghost': 1 },
        'fighting': { 'normal': 2, 'rock': 2, 'steel': 2, 'ghost': 0, 'flying': 0.5, 'psychic': 0.5, 'fairy': 0.5 },
        'poison': { 'grass': 2, 'poison': 0.5, 'ghost': 1, 'ground': 0.5, 'steel': 0 },
        'ground': { 'fire': 2, 'electric': 2, 'water': 0.5, 'grass': 0.5, 'ice': 2, 'flying': 0 },
        'flying': { 'fighting': 2, 'bug': 2, 'grass': 2, 'electric': 0.5, 'steel': 1, 'ghost': 1 },
        'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'ghost': 1 },
        'bug': { 'grass': 2, 'fire': 0.5, 'fighting': 0.5, 'ghost': 1 },
        'rock': { 'fire': 2, 'electric': 1, 'grass': 1, 'ice': 2, 'fighting': 0.5, 'bug': 2, 'ghost': 1 },
        'ghost': { 'ghost': 2, 'normal': 0, 'psychic': 2, 'dark': 1 },
        'dragon': { 'dragon': 2, 'fairy': 0, 'steel': 0.5, 'ghost': 1 },
        'dark': { 'psychic': 2, 'ghost': 2, 'fairy': 0.5, 'fighting': 0.5, 'dark': 1 },
        'steel': { 'rock': 2, 'bug': 2, 'grass': 1, 'fire': 0.5, 'steel': 0.5, 'ghost': 1 },
        'fairy': { 'fighting': 2, 'dragon': 2, 'dark': 2, 'steel': 0.5, 'ghost': 1 }
    };

    let efectividad = 1;
    if (efectividadTipos[atacante.type] && efectividadTipos[atacante.type][defensor.type]) {
        efectividad = efectividadTipos[atacante.type][defensor.type];
    }

    danio *= efectividad;
    
    return Math.max(danio, 1);
}

async function iniciarBatalla() {
    if (!selectedPokemon || !enemyPokemon) {
        alert('Ambos Pokémon deben ser seleccionados.');
        return;
    }

    let atacante = selectedPokemon.speed > enemyPokemon.speed ? selectedPokemon : enemyPokemon;
    let defensor = atacante === selectedPokemon ? enemyPokemon : selectedPokemon;

    const logContainer = document.getElementById('battle-log');
    logContainer.innerHTML = '<h3>Registros de batalla</h3>';

    while (selectedPokemon.hp > 0 && enemyPokemon.hp > 0) {
        const danio = calcularDanio(atacante, defensor);
        defensor.hp -= danio;

        const barraHpDefensor = document.getElementById(`${defensor === selectedPokemon ? 'player' : 'enemy'}-hp`).querySelector('.hp-bar');
        barraHpDefensor.style.width = `${Math.max((defensor.hp / 100) * 100, 0)}%`;

        const entradaLog = document.createElement('p');
        entradaLog.textContent = `${atacante.name} le causó ${danio} de daño a ${defensor.name}`;
        logContainer.appendChild(entradaLog);
        
        const vidaRestante = document.createElement('p');
        vidaRestante.textContent = `${defensor.name} tiene ${Math.max(defensor.hp, 0)} de vida restante.`;
        logContainer.appendChild(vidaRestante);

        logContainer.scrollTop = logContainer.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 1000));

        [atacante, defensor] = [defensor, atacante];
    }

    const mainDiv = document.querySelector('main');
    const ganador = selectedPokemon.hp > 0 ? selectedPokemon : enemyPokemon;
    const entradaLog = document.createElement('div');
    entradaLog.classList.add('entradaLog');
    entradaLog.textContent = `${ganador.name} gana la batalla!`;
    mainDiv.appendChild(entradaLog);
}
