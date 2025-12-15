// api.js

export async function obtenerPokemonPorGeneracion(generacion, pagina = 1, limite = 20) {
    const desplazamiento = (pagina - 1) * limite;  // Cálculo de desplazamiento para paginación
    let url = '';
    if (generacion) {
      // Si hay generación seleccionada, traemos los Pokémon de esa generación
      url = `https://pokeapi.co/api/v2/generation/${generacion}`;
    } else {
      // Si no hay generación seleccionada, traemos los Pokémon globales
      url = `https://pokeapi.co/api/v2/pokemon?offset=${desplazamiento}&limit=${limite}`;
    }
  
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos;
  }
  
  export async function obtenerDetallesPokemon(url) {
    const respuesta = await fetch(url);
    const detalles = await respuesta.json();
    return detalles;
  }
  