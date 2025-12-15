// pokemon.js

export class Pokemon {
  constructor(id, nombre, sprite, url) {
    this.id = id;  // ID único
    this.nombre = nombre;
    this.sprite = sprite;
    this.url = url;
  }

  static async crearDesdeAPI(datos) {
    const { name, url } = datos;
    const detalles = await fetch(url).then(res => res.json());
    const id = detalles.id;  // ID del Pokémon desde la API
    return new Pokemon(id, name, detalles.sprites.front_default, url);
  }
}

export class Equipo {
  constructor(id, nombre = '', jugador) {
    this.id = id;  // ID único para el equipo
    this.nombre = nombre;
    this.pokemon = [];
    this.jugador=jugador;
  }

  agregarPokemon(pokemon) {
    if (this.pokemon.length < 6) {
      this.pokemon.push(pokemon);
    }
  }

  esValido() {
    return this.pokemon.length === 6;
  }
}
