// app.js

import { obtenerPokemonPorGeneracion, obtenerDetallesPokemon } from './api.js';
import { Pokemon, Equipo } from './pokemon.js';

const uriSprites = {uri:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/', ext:'.png'};
const cuadros = document.querySelectorAll('.cuadro');
const ventanaEmergente = document.getElementById('ventanaEmergente');
const listaPokemon = document.getElementById('listaPokemon');
const cerrarVentanaEmergenteBtn = document.getElementById('cerrarVentanaEmergente');
const paginadorAnterior = document.getElementById('anterior');
const paginadorSiguiente = document.getElementById('siguiente');
const filtroGeneracion = document.getElementById('filtro-generacion');
const buscadorPokemon = document.getElementById('buscador-pokemon');
const limpiarDatos = document.getElementById('limpiarDatos');
let equipoActual = new Equipo(Date.now());  // Usamos el timestamp como ID único para el equipo
let cuadroSeleccionado = null;
let paginaActual = 1;
let totalPokemons = 0;
let todosLosPokemon = [];
const limitePorPagina = 20;

async function cargarPokemon(pagina) {
  const generacion = filtroGeneracion.value; // Obtener la generación seleccionada
  console.log('Generación seleccionada:', generacion);
  listaPokemon.innerHTML = ''; // Limpiar la lista de Pokémon

  let pokemonData = [];
  const todosLosPokemon = JSON.parse(localStorage.getItem('pokemons')) || [];

  if (generacion) {
    // Obtener los Pokémon de la generación seleccionada
    const generaciones = JSON.parse(localStorage.getItem('generaciones')) || [];
    const generacionSeleccionada = generaciones.find(gen => gen.id == generacion);
    if (generacionSeleccionada && generacionSeleccionada.pokemons) {
      const pokemonIds = Object.values(generacionSeleccionada.pokemons);
      pokemonData = todosLosPokemon.filter(pokemon => pokemonIds.includes(pokemon.id));
    } else {
      console.error('No se encontraron Pokémon para la generación seleccionada');
    }

    // Calcular el total de Pokémon de la generación
    totalPokemons = pokemonData.length;

    // Dividir los Pokémon de la generación en páginas
    const inicio = (pagina - 1) * limitePorPagina;
    const fin = Math.min(inicio + limitePorPagina, totalPokemons);
    pokemonData = pokemonData.slice(inicio, fin); // Solo cargar el bloque de la página actual
  } else {
    // Obtener todos los Pokémon globales
    pokemonData = todosLosPokemon.slice((pagina - 1) * limitePorPagina, pagina * limitePorPagina);
    totalPokemons = todosLosPokemon.length;
    console.log(pokemonData);
  }

  // Mostrar tarjetas de Pokémon
  for (const pokemon of pokemonData) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-pokemon');
    tarjeta.innerHTML = ` 
      <img src="${uriSprites.uri}${pokemon.id}${uriSprites.ext}" alt="${pokemon.name}">
      <h4>${pokemon.name}</h4>
    `;
    tarjeta.onclick = () => seleccionarPokemon(pokemon.id);
    listaPokemon.appendChild(tarjeta);
  }

  // Configurar botones de paginación
  paginadorAnterior.disabled = pagina === 1;
  paginadorSiguiente.disabled = pagina * limitePorPagina >= totalPokemons;
}

// Evento para el filtro de generación
filtroGeneracion.addEventListener('change', () => {
  paginaActual = 1; // Reiniciar siempre la página al cambiar de generación
  cargarPokemon(paginaActual); // Cargar la primera página para la nueva generación
});

// Evento para el buscador
buscadorPokemon.addEventListener('input', async (e) => {
  const terminoBusqueda = e.target.value.toLowerCase();
  const generacion = filtroGeneracion.value; // Obtener la generación seleccionada
  let pokemonData = [];

  if (generacion) {
    const generaciones = JSON.parse(localStorage.getItem('generaciones')) || [];
    const generacionSeleccionada = generaciones.find(gen => gen.id == generacion);
    if (generacionSeleccionada && generacionSeleccionada.pokemons) {
      const pokemonIds = Object.values(generacionSeleccionada.pokemons);
      pokemonData = JSON.parse(localStorage.getItem('pokemons')).filter(pokemon => pokemonIds.includes(pokemon.id));
    }
  } else {
    pokemonData = JSON.parse(localStorage.getItem('pokemons')) || [];
  }

  const resultados = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(terminoBusqueda));
  listaPokemon.innerHTML = ''; // Limpiar la lista de Pokémon

  for (const pokemon of resultados) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-pokemon');
    tarjeta.innerHTML = ` 
      <img src="${uriSprites.uri}${pokemon.id}${uriSprites.ext}" alt="${pokemon.name}">
      <h4>${pokemon.name}</h4>
    `;
    tarjeta.onclick = () => seleccionarPokemon(pokemon.id);
    listaPokemon.appendChild(tarjeta);
  }
});

// Inicializar la carga de Pokémon
cargarPokemon(paginaActual);

// Inicializar la carga de Pokémon
cargarPokemon(paginaActual);

// Evento de cambio de generación
filtroGeneracion.addEventListener('change', () => {
  paginaActual = 1; // Reiniciar siempre la página al cambiar de generación
  cargarPokemon(paginaActual); // Cargar la primera página para la nueva generación
});

// Configurar botones de paginación
paginadorAnterior.addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    cargarPokemon(paginaActual); // Cargar la página anterior
  }
});

paginadorSiguiente.addEventListener('click', () => {
  if (paginaActual * limitePorPagina < totalPokemons) {
    paginaActual++;
    cargarPokemon(paginaActual); // Cargar la página siguiente
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => cargarPokemon(paginaActual));


async function seleccionarPokemon(id) {
  const cuadro = cuadros[cuadroSeleccionado];
  const pokemon = await obtenerDetallesPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`);
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
  cuadroSeleccionado = index; // Seleccionar el cuadro actual
  paginaActual = 1; // Reiniciar siempre a la primera página al abrir
  cargarPokemon(paginaActual); // Cargar Pokémon de la primera página
  ventanaEmergente.classList.remove('hidden'); // Mostrar la ventana emergente
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
    Swal.fire('Por favor, asigna un nombre al equipo antes de guardarlo.');
    return;
  }

  if (!equipoActual.esValido()) {
    Swal.fire('Tu equipo debe tener 6 Pokémon antes de guardarlo.');
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
    })),
    jugador: 'humano',
  };

  // Guardamos el equipo en el localStorage
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];
  equiposGuardados.push(equipoParaGuardar);
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  Swal.fire(`Equipo "${nombreEquipo}" guardado con éxito.`);
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
    if (equipo.jugador === 'humano') {
      const item = document.createElement('li');
      item.innerHTML = `
      <h4>${equipo.nombre}</h4>
      <div>
        ${equipo.pokemons.map(pokemon => `
          <img src="${pokemon.sprite}" alt="${pokemon.nombre}" title="${pokemon.nombre}">
        `).join('')}
      </div>
      <button id="editarBtn${index}">Editar</button>
      <button id="eliminarBtn${index}">Eliminar</button>
    `;

      listaEquipos.appendChild(item);

      // Añadir los eventos para los botones de editar y eliminar
      document.getElementById(`editarBtn${index}`).addEventListener('click', () => editarEquipo(index));
      document.getElementById(`eliminarBtn${index}`).addEventListener('click', () => eliminarEquipo(index));
    } else {
      const item = document.createElement('li');
      item.innerHTML = `
      <h4>${equipo.nombre} (Equipo CPU)</h4>
      <div>
        ${equipo.pokemons.map(pokemon => `
          <img src="${pokemon.sprite}" alt="${pokemon.nombre}" title="${pokemon.nombre}">
        `).join('')}
      </div>
    `;

      listaEquipos.appendChild(item);
    }
  });
  console.log(equiposGuardados);
}

function editarEquipo(index) {
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];

  // Verificar que el índice es válido
  if (index < 0 || index >= equiposGuardados.length) {
    console.error('Índice de equipo no válido:', index);
    return;
  }

  const equipo = equiposGuardados[index];

  // Verificar que el equipo es válido
  if (!equipo || !equipo.nombre || !equipo.pokemons) {
    console.error('Equipo no válido:', equipo);
    return;
  }

  // Asignar el nombre del equipo al input de nombre
  document.getElementById('nombreEquipo').value = equipo.nombre;

  // Restaurar las imágenes y nombres de los Pokémon
  equipo.pokemons.forEach((pokemon, i) => {
    cuadros[i].innerHTML = `
      <img src="${pokemon.sprite}" alt="${pokemon.nombre}">
      <span>${pokemon.nombre}</span>
    `;
  });

  // Asignar el equipo actual con los datos del equipo a editar
  equipoActual = new Equipo(equipo.nombre);
  equipo.pokemons.forEach(pokemon => equipoActual.agregarPokemon(pokemon));

  // Mantener el ID original del equipo para editarlo correctamente
  equipoActual.id = equipo.id;

  // Cambiar el botón para guardar los cambios
  document.getElementById('guardarEquipo').textContent = 'Guardar cambios';

  // Al guardar, actualizar el equipo en su índice correspondiente
  document.getElementById('guardarEquipo').onclick = () => {
    guardarCambiosEquipo(index);
  };
}

function reiniciarFormulario() {
  equipoActual = null;
  document.getElementById('nombreEquipo').value = '';
  cuadros.forEach(cuadro => (cuadro.innerHTML = ''));
  document.getElementById('guardarEquipo').textContent = 'Crear equipo';
  document.getElementById('guardarEquipo').onclick = guardarEquipo;
}

function guardarCambiosEquipo(index) {
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];

  // Actualizar el equipo en su índice correspondiente
  equiposGuardados[index] = {
    id: equipoActual.id, // Mantener el ID del equipo
    nombre: document.getElementById('nombreEquipo').value, // Actualizar el nombre
    pokemons: equipoActual.pokemon, // Actualizar los Pokémon
  };

  // Guardar los cambios en el localStorage
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  //Eliminar el equipo viejo
  eliminarEquipo(equipoActual.id);

  // Actualizar la lista de equipos en la UI
  mostrarEquiposGuardados();

  // Reiniciar el formulario
  reiniciarFormulario();
}


function eliminarEquipo(id) {
  const equiposGuardados = JSON.parse(localStorage.getItem('equiposPokemon')) || [];
  const index = equiposGuardados.findIndex(equipo => equipo.id === id);
  equiposGuardados.splice(index, 1); // Eliminar el equipo seleccionado
  localStorage.setItem('equiposPokemon', JSON.stringify(equiposGuardados));

  Swal.fire('Equipo eliminado con éxito.');
  mostrarEquiposGuardados(); // Actualizar la lista de equipos guardados
}

// Inicialización
document.getElementById('guardarEquipo').addEventListener('click', guardarEquipo);
document.getElementById('limpiarEquipo').addEventListener('click', limpiarEquipo);
document.getElementById('generarAleatorio').addEventListener('click', generarEquipoAleatorio);
document.addEventListener('DOMContentLoaded', mostrarEquiposGuardados);
document.addEventListener('DOMContentLoaded', () => cargarPokemon(paginaActual));
limpiarDatos.addEventListener('click', () => {
  const confirmacion = confirm('¿Estas seguro de que deseas borrar todos los datos? Esta accion no se puede deshacer');

  if (confirmacion) {
    localStorage.removeItem('equiposPokemon');
    mostrarEquiposGuardados();
  } else {
    Swal.fire('Operacion cancelada');
  }
})

cuadros.forEach((cuadro, index) => cuadro.addEventListener('click', () => mostrarVentanaEmergente(index)));
cerrarVentanaEmergenteBtn.addEventListener('click', () => ventanaEmergente.classList.add('hidden'));
