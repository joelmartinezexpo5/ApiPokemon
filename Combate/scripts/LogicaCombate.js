"use strict";

const uriSprites = {uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/', extension:''};
const ventanaEmergente = document.getElementById('ventanaEmergente');
const cerrarVentanaEmergenteBtn = document.getElementById('cerrarVentanaEmergente');



function generaAleatorio(min, max){
    return Math.random() * (max - min + 1) + min;
}

function calcularDanno(ataqueAtacante, defensaDefensor) {
    danno = (ataqueAtacante * generaAleatorio(0.2, 1) - defensaDefensor* generaAleatorio(0.4, 1)) + 2

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

    danno *= efectividad;
    
    return Math.max(danno, 1);
}

function compararVelocidades(velocidad1, velocidad2){
    return generaAleatorio(0.2 , velocidad1/255) - generaAleatorio(0.2 , velocidad2/255) > 0;
}

// Función para realizar un ataque
function realizarAtaque(atacante, defensor) {
    danno = calcularDanno(atacante, defensor)
    defensor.hp = max(defensor.hp - dano, 0) // Asegurarse de que HP no sea negativo
    agregarParrafoBattleLog(`${atacante.nombre} atacó a ${defensor.nombre} y causó ${danno} de daño.`)
}

function actualizarBarraVida(){

}

// Función principal para el combate
async function combate(pokemon1, pokemon2) {
    if (!selectedPokemon || !enemyPokemon) {
        alert('Se deben seleccionar ambos Pokémon.');
        return;
    }

    while (pokemon1.hp > 0 && pokemon2.hp > 0) {
        if (compararVelocidades(pokemon1.velocidad, pokemon2.velocidad)) {
            realizarAtaque(pokemon1, pokemon2)
            if (pokemon2.hp > 0) {
                realizarAtaque(pokemon2, pokemon1)
            }
        } else {
            realizarAtaque(pokemon2, pokemon1)
            if (pokemon1.hp > 0) {
                realizarAtaque(pokemon1, pokemon2)
            }
        }
    }

    if (pokemon1.hp > 0) {
        agregarParrafoBattleLog(`${pokemon1.nombre} ganó el combate!`)
    } else {
        agregarParrafoBattleLog(`${pokemon2.nombre} ganó el combate!`)
    }
}

// Función para seleccionar el siguiente Pokémon del equipo humano
function seleccionarPokemonHumano(equipoHumano) {
    // Aquí puedes implementar la lógica para permitir que el humano seleccione el próximo Pokémon
    // Por ejemplo, podrías mostrar un prompt o una interfaz gráfica para la selección
    // Para fines de este ejemplo, simplemente tomaremos el primer Pokémon con salud
    for (let i = 0; i < equipoHumano.length; i++) {
        if (equipoHumano[i].hp > 0) {
            return equipoHumano[i];
        }
    }
    return null;
}

// Función para seleccionar aleatoriamente el siguiente Pokémon de la máquina
function seleccionarPokemonMaquina(equipoMaquina) {
    let pokemonConSalud = equipoMaquina.filter(pokemon => pokemon.hp > 0);
    if (pokemonConSalud.length > 0) {
        let indiceAleatorio = Math.floor(generaAleatorio(0, pokemonConSalud.length - 1));
        return pokemonConSalud[indiceAleatorio];
    }
    return null;
}

// Función para el combate por equipos
function combatePorEquipos(equipoHumano, equipoMaquina) {
    let pokemonHumano = seleccionarPokemonHumano(equipoHumano);
    let pokemonMaquina = seleccionarPokemonMaquina(equipoMaquina);

    while (pokemonHumano && pokemonMaquina) {
        combate(pokemonHumano, pokemonMaquina);
        
        if (pokemonHumano.hp <= 0) {
            agregarParrafoBattleLog(`${pokemonHumano.nombre} ha sido derrotado.`);
            pokemonHumano = seleccionarPokemonHumano(equipoHumano);
        }
        
        if (pokemonMaquina.hp <= 0) {
            agregarParrafoBattleLog(`${pokemonMaquina.nombre} ha sido derrotado.`);
            pokemonMaquina = seleccionarPokemonMaquina(equipoMaquina);
        }
    }

    if (equipoHumano.every(pokemon => pokemon.hp <= 0)) {
        agregarParrafoBattleLog("¡La máquina ha ganado el combate por equipos!");
    } else if (equipoMaquina.every(pokemon => pokemon.hp <= 0)) {
        agregarParrafoBattleLog("¡Has ganado el combate por equipos!");
    }
}

// Función para agregar un <p> con el texto proporcionado
function agregarParrafoBattleLog(texto, tiempoEspera = 1000) {
    setTimeout(() => {
        var battleLog = document.getElementById("battle-log");
        if (battleLog) {
            var nuevoParrafo = document.createElement("p");
            nuevoParrafo.innerText = texto;
            battleLog.appendChild(nuevoParrafo);
        } else {
            console.error("No se encontró el elemento con id 'battle-log'");
        }
    }, tiempoEspera);
}

// Función para borrar todos los elementos hijos de battle-log
function borrarBattleLog() {
    var battleLog = document.getElementById("battle-log");
    if (battleLog) {
        battleLog.innerHTML = '';
    } else {
        console.error("No se encontró el elemento con id 'battle-log'");
    }
}

let selectedPokemon = null;
let enemyPokemon = null;

// Inicializa el juego
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('select-player-pokemon').addEventListener('click', () => mostrarSeleccionPokemon(false));
    document.getElementById('select-enemy-pokemon').addEventListener('click', () => mostrarSeleccionPokemon(true));
    document.getElementById('reset-selection').addEventListener('click', reiniciarSelecciones);
    document.getElementById('start-battle').addEventListener('click', iniciarBatalla);
});

function reiniciarSelecciones() {
    selectedPokemon = null;
    enemyPokemon = null;

    document.getElementById('player-name').textContent = 'Ningún Pokémon seleccionado';
    document.getElementById('enemy-name').textContent = 'Ningún Pokémon seleccionado';
    document.getElementById('player-image').style.display = 'none';
    document.getElementById('enemy-image').style.display = 'none';
}

async function mostrarSeleccionPokemon(esEnemigo) {
    const modal = document.createElement('div');
    modal.className = 'pokemon-modal';
    
    const grid = document.createElement('div');
    grid.className = 'pokemon-grid';

    for (const pokemon of pokemonList) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        const data = await obtenerPokemon(pokemon);

        card.innerHTML = `
            <img src="${uriSprites.uri}${data.id}${uriSprites.extension}" alt="${pokemon}">
            <h3>${pokemon}</h3>
        `;

        card.addEventListener('click', () => {
            seleccionaPokemon(data, esEnemigo);
            modal.remove();
        });

        grid.appendChild(card);
    }

    modal.appendChild(grid);
    document.body.appendChild(modal);
}

function seleccionarPokemon(pokemon) {
    const cuadro = cuadros[cuadroSeleccionado];
  
    // Crear un objeto de Pokémon con todos los detalles (nombre, sprite y URL)
    const pokemonDetalle = {
      id: pokemon.id,  // Asegúrate de que estás usando el ID correcto
      nombre: pokemon.name,
      sprite: pokemon.sprites.front_default,
      url: pokemon.url
    };
  
    // Actualiza el Pokémon en el equipo actual en el cuadro correspondiente
    equipoActual.pokemon[cuadroSeleccionado] = pokemonDetalle;  // Reemplazamos el Pokémon en el equipo
  
    // Mostrar la imagen y el nombre del Pokémon en el cuadro seleccionado
    cuadro.innerHTML = `
      <img src="${pokemonDetalle.sprite}" alt="${pokemonDetalle.nombre}">
      <span>${pokemonDetalle.nombre}</span>
    `;
  
    // Ocultar la ventana emergente
    ventanaEmergente.classList.add('hidden');
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

function seleccionaPokemon(pokemon, esEnemigo) {
    if (esEnemigo) {
        enemyPokemon = pokemon;
        actualizarUIPokemon(enemyPokemon, 'enemy');
        document.getElementById('start-battle').style.display = 'block';
    } else {
        selectedPokemon = pokemon;
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
    image.src = `${uriSprites.uri}${data.id}${uriSprites.extension}`;
    image.style.display = 'block'; // Asegúrate de que la imagen esté visible

    // Actualiza la barra de HP
    const barraHp = document.getElementById(`${idElemento}-hp`).querySelector('.hp-bar');
    barraHp.style.width = '100%'; // Establece la barra a 100% al inicio
}


/**
 * 
 */
function mostrarVentanaEmergente(index) {
    cuadroSeleccionado = index; // Seleccionar el cuadro actual
    paginaActual = 1; // Reiniciar siempre a la primera página al abrir
    cargarPokemon(paginaActual); // Cargar Pokémon de la primera página
    ventanaEmergente.classList.remove('hidden'); // Mostrar la ventana emergente
}

cerrarVentanaEmergenteBtn.addEventListener('click', () => ventanaEmergente.classList.add('hidden'));

