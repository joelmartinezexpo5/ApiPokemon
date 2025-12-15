import { Pokemon } from './pokemon.js';

class PokemonAPI {
    constructor() {
        this.apiBaseURL = 'https://pokeapi.co/api/v2/';
        this.pokemonURL = `${this.apiBaseURL}pokemon/`;
        this.generationURL = `${this.apiBaseURL}generation/`;
    }
    
    async fetchPokemon(id) {
        try {
            const response = await fetch(`${this.pokemonURL}${id}`);
            const data = await response.json();
            return new Pokemon(
                data.id,
                data.name,
                data.types.map(typeInfo => typeInfo.type),
                data.height,
                data.weight,
                data.abilities.map(abilityInfo => abilityInfo.ability.name),
                data.stats.map(statInfo => ({ name: statInfo.stat.name, value: statInfo.base_stat }))
            );
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    }

    async saveAllPokemonToLocalStorage() {
        try {
            const promises = [];
            for (let i = 1; i <= 1025; i++) {
                promises.push(this.fetchPokemon(i));
            }
            const allPokemon = await Promise.all(promises);
            allPokemon.forEach(pokemon => {
                if (pokemon) {
                    localStorage.setItem(`pokemon_${pokemon.id}`, JSON.stringify(pokemon));
                }
            });
        } catch (error) {
            console.error('Error saving Pokémon to localStorage:', error);
        }
    }

    async fetchGenerations() {
        try {
            const response = await fetch(this.generationURL);
            const data = await response.json();
            return data.results; // Devuelve todas las generaciones
        } catch (error) {
            console.error('Error fetching generations:', error);
        }
    }

    async fetchGenerationData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.pokemon_species.map(species => species.name);
        } catch (error) {
            console.error('Error fetching generation data:', error);
        }
    }
}

export { PokemonAPI };