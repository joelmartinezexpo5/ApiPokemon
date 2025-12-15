// app.js

import { obtenerPokemonPorGeneracion, obtenerDetallesPokemon } from './api.js';
import { Pokemon, Equipo } from './pokemon.js';

const cuadros = document.querySelectorAll('.cuadro');
const ventanaEmergente = document.getElementById('ventanaEmergente');
const listaPokemon = document.getElementById('listaPokemon');
const cerrarVentanaEmergenteBtn = document.getElementById('cerrarVentanaEmergente');
const paginadorAnterior = document.getElementById('anterior');
const paginadorSiguiente = document.getElementById('siguiente');
const filtroGeneracion = document.getElementById('filtro-generacion');

let equipoActual = new Equipo(Date.now());  // Usamos el timestamp como ID único para el equipo
let cuadroSeleccionado = null;
let paginaActual = 1;
let totalPokemons = 0;
const limitePorPagina = 20;

async function cargarPokemon(pagina) {
  const generacion = filtroGeneracion.value; // Obtener generación seleccionada
  listaPokemon.innerHTML = ''; // Limpiar la lista de Pokémon
  let pokemonData = [];

  if (generacion) {
    // Obtener todos los Pokémon de la generación seleccionada
    const datos = await obtenerPokemonPorGeneracion(generacion);
    pokemonData = datos.pokemon_species;

    // Dividir los Pokémon de la generación en páginas
    const inicio = (pagina - 1) * limitePorPagina;
    const fin = inicio + limitePorPagina;
    pokemonData = pokemonData.slice(inicio, fin);
  } else {
    // Obtener Pokémon globales con paginación
    const datos = await obtenerPokemonPorGeneracion(null, pagina, limitePorPagina);
    pokemonData = datos.results;
  }

  // Mostrar tarjetas de Pokémon
  for (const pokemon of pokemonData) {
    const urlPokemon = generacion ? pokemon.url.replace('-species', '') : pokemon.url;
    const detalles = await obtenerDetallesPokemon(urlPokemon);

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-pokemon');
    tarjeta.innerHTML = ` 
      <img src="${detalles.sprites.front_default}" alt="${detalles.name}">
      <h4>${detalles.name}</h4>
    `;
    tarjeta.onclick = () => seleccionarPokemon(detalles);
    listaPokemon.appendChild(tarjeta);
  }

  // Configurar botones de paginación
  const totalPokemons = generacion 
    ? (await obtenerPokemonPorGeneracion(generacion)).pokemon_species.length
    : 898; // Total de Pokémon globales disponibles

  paginadorAnterior.disabled = pagina === 1;
  paginadorSiguiente.disabled = (pagina * limitePorPagina) >= totalPokemons;
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


function mostrarVentanaEmergente(index) {
  cuadroSeleccionado = index;
  paginaActual = 1;
  cargarPokemon(paginaActual);
  ventanaEmergente.classList.remove('hidden');
}

async function generarEquipoAleatorio() {
  const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
  const datos = (await respuesta.json()).results.sort(() => 0.5 - Math.random()).slice(0, 6);

  equipoActual = new Equipo(Date.now()); // Reiniciar el equipo con un nuevo ID único

  datos.forEach(async (pokemon, index) => {
    const detalles = await obtenerDetallesPokemon(pokemon.url);
    const pokemonInstancia = new Pokemon(detalles.id, detalles.name, detalles.sprites.front_default, pokemon.url);

    // Mostrar Pokémon en los cuadros
    cuadros[index].innerHTML = `
      <img src="${pokemonInstancia.sprite}" alt="${pokemonInstancia.nombre}">
      <span>${pokemonInstancia.nombre}</span>
    `;

    // Agregar Pokémon al equipo actual
    equipoActual.agregarPokemon(pokemonInstancia);
  });
}

function limpiarEquipo() {
  cuadros.forEach(c => (c.innerHTML = 'Seleccionar'));
  equipoActual = new Equipo(Date.now()); // Crear un nuevo equipo con ID único
}

function guardarEquipo() {
  const nombreEquipo = document.getElementById('nombreEquipo').value.trim();

  if (!nombreEquipo) {
    alert('Por favor, asigna un nombre al equipo antes de guardarlo.');
    return;
  }

  if (!equipoActual.esValido()) {
    alert('Tu equipo debe tener 6 Pokémon antes de guardarlo.');
    return;
  }

  // Guardamos los detalles completos de cada Pokémon (nombre, sprite y URL) junto con el ID del equipo
  const equipoParaGuardar = {
    id: equipoActual.id,  // Guardamos el ID único del equipo
    nombre: nombreEquipo,
    pokemons: equipoActual.pokemon.map(pokemon => ({
      id: pokemon.id,  // Guardamos el ID del Pokémon
      nombre: pokemon.nombre,
      sprite: pokemon.sprite,
      url: pokemon.url
    }))
  };

  // Guardamos el equipo en el localStorage
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];
  equiposGuardados.push(equipoParaGuardar);
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  alert(`Equipo "${nombreEquipo}" guardado con éxito.`);
  limpiarEquipo();
  mostrarEquiposGuardados();
}

function mostrarEquiposGuardados() {
  const listaEquipos = document.getElementById('listaEquipos');
  listaEquipos.innerHTML = '';  // Limpiar la lista antes de mostrar los equipos

  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];

  if (equiposGuardados.length === 0) {
    listaEquipos.innerHTML = '<p>No tienes equipos guardados.</p>';
    return;
  }

  equiposGuardados.forEach((equipo, index) => {
    const item = document.createElement('li');
    item.innerHTML = `
      <h4>${equipo.nombre}</h4>
      <div>
        ${equipo.pokemons.map(pokemon => `
          <img src="${pokemon.sprite}" alt="${pokemon.nombre}" title="${pokemon.nombre}">
        `).join('')}
      </div>
      <button id="editarBtn${equipo.id}">Editar</button>
      <button id="eliminarBtn${equipo.id}">Eliminar</button>
    `;
    
    listaEquipos.appendChild(item);

    // Añadir los eventos para los botones de editar y eliminar
    document.getElementById(`editarBtn${equipo.id}`).addEventListener('click', () => editarEquipo(equipo.id));
    document.getElementById(`eliminarBtn${equipo.id}`).addEventListener('click', () => eliminarEquipo(equipo.id));
  });
  console.log(equiposGuardados);
}

function editarEquipo(id) {
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];
  const equipo = equiposGuardados.find(equipo => equipo.id === id);

  // Asignamos el nombre del equipo al input de nombre
  document.getElementById('nombreEquipo').value = equipo.nombre;

  // Restauramos las imágenes y nombres de los Pokémon
  equipo.pokemons.forEach((pokemon, i) => {
    cuadros[i].innerHTML = `
      <img src="${pokemon.sprite}" alt="${pokemon.nombre}">
      <span>${pokemon.nombre}</span>
    `;
  });

  // Creamos un nuevo equipo con los Pokémon editados
  equipoActual = new Equipo(equipo.id, equipo.nombre);
  equipo.pokemons.forEach(pokemon => equipoActual.agregarPokemon(pokemon));

  // Actualizamos el botón para guardar cambios
  document.getElementById('guardarEquipo').textContent = 'Guardar cambios';
  document.getElementById('guardarEquipo').onclick = () => guardarCambiosEquipo(id);
}

function guardarCambiosEquipo(index) {
  const nombreEquipo = document.getElementById('nombreEquipo').value.trim();

  if (!nombreEquipo) {
    alert('Por favor, asigna un nombre al equipo antes de guardarlo.');
    return;
  }

  if (!equipoActual.esValido()) {
    alert('Tu equipo debe tener 6 Pokémon antes de guardarlo.');
    return;
  }

  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];

  // Encontrar el equipo original por su id y actualizarlo
  const equipoEditado = equiposGuardados.find(equipo => equipo.id === equiposGuardados[index].id);

  // Actualizamos el equipo editado con el nuevo nombre y Pokémon
  equipoEditado.nombre = nombreEquipo;
  equipoEditado.pokemons = equipoActual.pokemon;

  // Guardar el equipo editado en el localStorage
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  alert(`Equipo "${nombreEquipo}" actualizado con éxito.`);
  limpiarEquipo(); // Limpiar los cuadros
  mostrarEquiposGuardados(); // Volver a mostrar los equipos actualizados

  // Restaurar el texto del botón a 'Guardar Equipo'
  document.getElementById('guardarEquipo').textContent = 'Guardar Equipo';
  document.getElementById('guardarEquipo').onclick = guardarEquipo;
}

function eliminarEquipo(id) {
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];
  const index = equiposGuardados.findIndex(equipo => equipo.id === id);
  equiposGuardados.splice(index, 1); // Eliminar el equipo seleccionado
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  alert('Equipo eliminado con éxito.');
  mostrarEquiposGuardados(); // Actualizar la lista de equipos guardados
}

// Inicialización
document.getElementById('guardarEquipo').addEventListener('click', guardarEquipo);
document.getElementById('limpiarEquipo').addEventListener('click', limpiarEquipo);
document.getElementById('generarAleatorio').addEventListener('click', generarEquipoAleatorio);
document.addEventListener('DOMContentLoaded', mostrarEquiposGuardados);

cuadros.forEach((cuadro, index) => cuadro.addEventListener('click', () => mostrarVentanaEmergente(index)));
cerrarVentanaEmergenteBtn.addEventListener('click', () => ventanaEmergente.classList.add('hidden'));
