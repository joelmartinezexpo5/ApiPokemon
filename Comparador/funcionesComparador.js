'use strict'
/**
 * Función para mostrar los Pokémon comparados
 */
async function mostrarPokemons(listaPokemon, pokemonId1, pokemonId2) {
    // Buscar los Pokémon por ID
    const pokemon1 = listaPokemon.find(pokemon => pokemon.id == pokemonId1);
    const pokemon2 = listaPokemon.find(pokemon => pokemon.id == pokemonId2);

    // Mostrar los detalles de ambos Pokémon en la consola
    console.log(pokemon1, pokemon2);

    // Verificar si se encontró el primer Pokémon
    const pokemonImagen1 = document.getElementById('imagenPokemon1');
    const quitarPokemon1 = document.getElementById('quitarPokemon1');
    if (pokemon1) {
        if (pokemonImagen1) {
            pokemonImagen1.innerHTML = `
                <div class="pokemon-name">${pokemon1.name}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon1.id}.png" alt="${pokemon1.name}">
            `;
            pokemonImagen1.classList.remove('hidden');
            quitarPokemon1.classList.remove('hidden');
        } else {
            console.error('No se encontró el elemento con ID "imagenPokemon1"');
        }
    } else {
        if (pokemonImagen1) {
            pokemonImagen1.classList.add('hidden');
            quitarPokemon1.classList.add('hidden');
        }
        console.error(`No se encontró el Pokémon con ID ${pokemonId1}`);
    }

    // Verificar si se encontró el segundo Pokémon
    const pokemonImagen2 = document.getElementById('imagenPokemon2');
    const quitarPokemon2 = document.getElementById('quitarPokemon2');
    if (pokemon2) {
        if (pokemonImagen2) {
            pokemonImagen2.innerHTML = `
                <div class="pokemon-name">${pokemon2.name}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon2.id}.png" alt="${pokemon2.name}">
            `;
            pokemonImagen2.classList.remove('hidden');
            quitarPokemon2.classList.remove('hidden');
        } else {
            console.error('No se encontró el elemento con ID "imagenPokemon2"');
        }
    } else {
        if (pokemonImagen2) {
            pokemonImagen2.classList.add('hidden');
            quitarPokemon2.classList.add('hidden');
        }
        console.error(`No se encontró el Pokémon con ID ${pokemonId2}`);
    }

    if (pokemon1 && pokemon2) {
        const phPokemons = document.getElementById('hpPokemons');
        const atPokemons = document.getElementById('atPokemons');
        const dfPokemons = document.getElementById('dfPokemons');
        const vlPokemons = document.getElementById('vlPokemons');
        const atEPokemons = document.getElementById('atEPokemons');
        const dfEPokemons = document.getElementById('dfEPokemons');
        // Función auxiliar para comparar valores y agregar clase de color
        const compararConEstilo = (valor1, valor2) => {
            if (valor1 > valor2) {
                return `<span style="background-color: green; color: white; padding: 2px;">${valor1}</span> vs 
                    <span style="background-color: red; color: white; padding: 2px;">${valor2}</span>`;
            } else if (valor1 < valor2) {
                return `<span style="background-color: red; color: white; padding: 2px;">${valor1}</span> vs 
                    <span style="background-color: green; color: white; padding: 2px;">${valor2}</span>`;
            }
            return `<span style="background-color: gray; color: white; padding: 2px;">${valor1}</span> vs 
                <span style="background-color: gray; color: white; padding: 2px;">${valor2}</span>`;
        };

        // Actualizar contenido con estilos
        phPokemons.innerHTML = compararConEstilo(pokemon1.stats[0].Ps, pokemon2.stats[0].Ps);
        atPokemons.innerHTML = compararConEstilo(pokemon1.stats[1].Ataque, pokemon2.stats[1].Ataque);
        dfPokemons.innerHTML = compararConEstilo(pokemon1.stats[2].Defensa, pokemon2.stats[2].Defensa);
        vlPokemons.innerHTML = compararConEstilo(pokemon1.stats[5].Velocidad, pokemon2.stats[5].Velocidad);
        atEPokemons.innerHTML = compararConEstilo(pokemon1.stats[3].Ataque_Especial, pokemon2.stats[3].Ataque_Especial);
        dfEPokemons.innerHTML = compararConEstilo(pokemon1.stats[4].Defensa_Especial, pokemon2.stats[4].Defensa_Especial);
    }
}

// Función para mostrar la lista paginada de Pokémon
async function mostrarListaPaginada(pokemonSection) {
    const listaPokemon = JSON.parse(localStorage.getItem('pokemons')) || [];
    const section = document.querySelector(`section.${pokemonSection}`);
    const container = document.getElementById(`pokemon-list-container-${pokemonSection}`);
    container.innerHTML = ''; // Limpiar contenido previo

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar por nombre';
    searchInput.addEventListener('input', () => filtrarPokemons(listaPokemon, searchInput.value, pokemonSection));
    container.appendChild(searchInput);

    const lista = document.createElement('div');
    lista.id = `pokemon-list-${pokemonSection}`;
    container.appendChild(lista);

    const paginacion = document.createElement('div');
    paginacion.className = 'paginacion';
    container.appendChild(paginacion);

    const flechaIzquierda = document.createElement('button');
    flechaIzquierda.innerHTML = '&larr;';
    flechaIzquierda.addEventListener('click', () => cambiarPagina(listaPokemon, -1, pokemonSection));
    paginacion.appendChild(flechaIzquierda);

    const flechaDerecha = document.createElement('button');
    flechaDerecha.innerHTML = '&rarr;';
    flechaDerecha.addEventListener('click', () => cambiarPagina(listaPokemon, 1, pokemonSection));
    paginacion.appendChild(flechaDerecha);

    paginarPokemons(listaPokemon, 1, pokemonSection);
}

let paginaActual = { pokemon1: 1, pokemon2: 1 };
let seleccionados = { pokemon1: null, pokemon2: null };

// Función para cambiar de página
function cambiarPagina(listaPokemon, direccion, pokemonSection) {
    const totalPaginas = Math.ceil(listaPokemon.length / 20);
    paginaActual[pokemonSection] += direccion;
    if (paginaActual[pokemonSection] < 1) paginaActual[pokemonSection] = 1;
    if (paginaActual[pokemonSection] > totalPaginas) paginaActual[pokemonSection] = totalPaginas;
    paginarPokemons(listaPokemon, paginaActual[pokemonSection], pokemonSection);
}

// Función para filtrar Pokémon por nombre
function filtrarPokemons(listaPokemon, query, pokemonSection) {
    const lista = document.getElementById(`pokemon-list-${pokemonSection}`);
    lista.innerHTML = '';
    const pokemonsFiltrados = listaPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
    paginarPokemons(pokemonsFiltrados, 1, pokemonSection);
}

// Función para paginar Pokémon
function paginarPokemons(listaPokemon, pagina, pokemonSection) {
    const lista = document.getElementById(`pokemon-list-${pokemonSection}`);
    lista.innerHTML = '';
    const itemsPorPagina = 20;
    const inicio = (pagina - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const pokemonsPaginados = listaPokemon.slice(inicio, fin);

    pokemonsPaginados.forEach(pokemon => {
        if (pokemon.id !== seleccionados.pokemon1 && pokemon.id !== seleccionados.pokemon2) {
            const item = document.createElement('div');
            item.className = 'pokemon-item';
            item.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" style="width: 20px; height: 20px;"> ${pokemon.name}`;
            item.addEventListener('click', () => seleccionarPokemon(pokemon.id, pokemonSection));
            lista.appendChild(item);
        }
    });
}

// Función para seleccionar Pokémon
function seleccionarPokemon(id, pokemonSection) {
    if (seleccionados.pokemon1 === id || seleccionados.pokemon2 === id) {
        console.error('No se pueden comparar Pokémon iguales');
        return;
    }

    seleccionados[pokemonSection] = id;

    mostrarPokemons(JSON.parse(localStorage.getItem('pokemons')), seleccionados.pokemon1, seleccionados.pokemon2);

    // Ocultar la lista de Pokémon seleccionada
    document.getElementById(`pokemon-list-container-${pokemonSection}`).style.display = 'none';
}

// Función para quitar Pokémon seleccionado
function quitarPokemon(pokemonSection) {
    seleccionados[pokemonSection] = null;
    const pokemonImagen = document.getElementById(`imagenPokemon${pokemonSection === 'pokemon1' ? '1' : '2'}`);
    pokemonImagen.innerHTML = '';
    pokemonImagen.classList.add('hidden');
    document.getElementById(`quitarPokemon${pokemonSection === 'pokemon1' ? '1' : '2'}`).classList.add('hidden');
    document.getElementById(`pokemon-list-container-${pokemonSection}`).style.display = 'block';
    paginarPokemons(JSON.parse(localStorage.getItem('pokemons')), paginaActual[pokemonSection], pokemonSection);
    if (!seleccionados.pokemon1 || !seleccionados.pokemon2) {
        document.getElementById('hpPokemons').innerHTML = '';
        document.getElementById('atPokemons').innerHTML = '';
        document.getElementById('dfPokemons').innerHTML = '';
        document.getElementById('vlPokemons').innerHTML = '';
        document.getElementById('atEPokemons').innerHTML = '';
        document.getElementById('dfEPokemons').innerHTML = '';
    }
}

document.getElementById('quitarPokemon1').addEventListener('click', () => quitarPokemon('pokemon1'));
document.getElementById('quitarPokemon2').addEventListener('click', () => quitarPokemon('pokemon2'));
document.getElementById('volverMain').addEventListener('click', () => {
    window.location.href = '../PaginaInicio/index.html';
});

async function iniciar() {
    let listaPokemon1 = JSON.parse(localStorage.getItem('pokemons')) || [];

    if (listaPokemon1.length > 0) {
        console.log('Pokémon cargados en localStorage');
        mostrarListaPaginada('pokemon1');
        mostrarListaPaginada('pokemon2');
    } else {
        console.error('No se encontraron Pokémon en localStorage');
    }
}

iniciar();