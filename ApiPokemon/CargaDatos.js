/**
 * Funcion que obtiene los tipos
 * 
 */
async function cargarTipo() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/type/?offset=0&limit=21");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const habilidades = await response.json();

        return habilidades;

    } catch (error) {
        console.error(error);
    }
}

/**
 * Funciones que obtiene las generaciones
 * @
 */
async function cargarGeneraciones() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/generation/?offset=0&limit=50");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const habilidades = await response.json();

        return habilidades;

    } catch (error) {
        console.error(error);
    }
}

/**Funcion que obtiene todas las regiones */
async function cargarRegion() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/region?offset=0&limit=0");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const habilidades = await response.json();

        return habilidades;

    } catch (error) {
        console.error(error);
    }
}

/**
 * Funcion que obtiene los pokemons
 */
async function cargarPokemon(offset, limit) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const habilidades = await response.json();

        return habilidades;

    } catch (error) {
        console.error(error);
    }
}

/**
 * Funcion que carga la informacion de un pokemon
 * 
 * 
 */
export async function cargarInfoPokemon(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dato = await response.json();

        return dato;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Función que carga la informacion de una generación
 * 
 * 
 */
async function cargarInfoGeneracion(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/generation/${id}/`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dato = await response.json();

        return dato;
    } catch (error) {
        console.error(error.message);
    }
}


/**
 * Función que carga la información de un tipo
 * 
 * 
 */
export async function cargarInfoTipo(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${id}/`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dato = await response.json();

        return dato;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Función que carga la info de un género
 * @param {int} id idGenero 
 * 
 */
async function cargarInfoGenero(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/gender/${id}/`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dato = await response.json();

        return dato;
    } catch (error) {
        console.error(error.message);
    }
}

async function cargarInfoStat(id) {
    try {
        const response = await fetch(` https://pokeapi.co/api/v2/stat/${id}/`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const dato = await response.json();

        return dato;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Función que formatea las 
 * @param {Array} listaStats 
 * @returns 
 */
function formatearStats(listaStats) {
    try {
        let stats = [];
        let objStat = {};
        listaStats.forEach(stat => {

            let objStat = {};
            switch (stat.stat.name) {
                case 'hp':
                    objStat.Ps = stat.base_stat;
                    break;
                case 'attack':
                    objStat.Ataque = stat.base_stat;
                    break;
                case 'defense':
                    objStat.Defensa = stat.base_stat;
                    break;
                case 'special-attack':
                    objStat.Ataque_Especial = stat.base_stat;
                    break;
                case 'special-defense':
                    objStat.Defensa_Especial = stat.base_stat;
                    break;
                case 'speed':
                    objStat.Velocidad = stat.base_stat;
                    break;
            }
            stats.push(objStat);
        });

        return stats;
    } catch (error) {
        console.error(error);
    }


}

function formatearTypes(listaTipos) {
    let tipos = [];
    listaTipos.forEach(tipo => {
        let objTipo = {}
        switch (tipo.type.name) {
            case 'normal':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Normal';
                objTipo.id = 1;
                tipos.push(objTipo);
                break;
            case 'fighting':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Lucha';
                objTipo.id = 2;
                tipos.push(objTipo);
                break;
            case 'flying':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Volador';
                objTipo.id = 3;
                tipos.push(objTipo);
                break;
            case 'poison':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Veneno';
                objTipo.id = 4;
                tipos.push(objTipo);
                break;
            case 'ground':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Tierra';
                objTipo.id = 5;
                tipos.push(objTipo);
                break;
            case 'rock':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Roca';
                objTipo.id = 6;
                tipos.push(objTipo);
                break;
            case 'bug':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Bicho';
                objTipo.id = 7;
                tipos.push(objTipo);
                break;
            case 'ghost':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Fantasma';
                objTipo.id = 8;
                tipos.push(objTipo);
                break;
            case 'steel':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Acero';
                objTipo.id = 9;
                tipos.push(objTipo);
                break;
            case 'fire':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Fuego';
                objTipo.id = 10;
                tipos.push(objTipo);
                break;
            case 'water':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Agua';
                objTipo.id = 11;
                tipos.push(objTipo);
                break;
            case 'grass':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Planta';
                objTipo.id = 12;
                tipos.push(objTipo);
                break;
            case 'electric':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Eléctrico';
                objTipo.id = 13;
                tipos.push(objTipo);
                break;
            case 'psychic':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Psíquico';
                objTipo.id = 14;
                tipos.push(objTipo);
                break;
            case 'ice':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Hielo';
                objTipo.id = 15;
                tipos.push(objTipo);
                break;
            case 'dragon':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Dragon';
                objTipo.id = 16;
                tipos.push(objTipo);
                break;
            case 'dark':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Siniestro';
                objTipo.id = 17;
                tipos.push(objTipo);
                break;
            case 'fairy':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Hada';
                objTipo.id = 18;
                tipos.push(objTipo);
                break;
            case 'stellar':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Stellar';
                objTipo.id = 19;
                tipos.push(objTipo);
                break;
            case 'unknow':
                objTipo.name = tipo.type.name;
                objTipo.nombre = '???';
                objTipo.id = 20;
                tipos.push(objTipo);
                break;
            case 'shadow':
                objTipo.name = tipo.type.name;
                objTipo.nombre = 'Ombra';
                objTipo.id = 21;
                tipos.push(objTipo);
                break;
        }

    })

    return tipos;
}

function formatearTipoDaño(listaDanio) {
    let tiposDanio = {};

    listaDanio.double_damage_from.forEach(p => {
        tiposDanio.doble_de_daño_de = formatearTipos(p.name);
    })
    listaDanio.double_damage_to.forEach(p => {
        tiposDanio.doble_daño_a = formatearTipos(p.name);
    });

    listaDanio.half_damage_from.forEach(p => {
        tiposDanio.mitad_daño_de = formatearTipos(p.name);
    });

    listaDanio.half_damage_to.forEach(p => {
        tiposDanio.mitad_daño_a = formatearTipos(p.name);
    });

    listaDanio.no_damage_from.forEach(p => {
        tiposDanio.no_daño_de = formatearTipos(p.name);
    });

    listaDanio.no_damage_to.forEach(p => {
        tiposDanio.no_daño_a = formatearTipos(p.name);
    });


    return tiposDanio;
}

function formatearTipos(tipo) {
    let nombre = '';
    switch (tipo) {
        case 'normal':
            nombre = 'Normal';
            break;
        case 'fighting':
            nombre = 'Lucha';
            break;
        case 'flying':
            nombre = 'Volador';
            break;
        case 'poison':
            nombre = 'Veneno';
            break;
        case 'ground':
            nombre = 'Tierra';
            break;
        case 'rock':
            nombre = 'Roca';
            break;
        case 'bug':
            nombre = 'Bicho';
            break;
        case 'ghost':
            nombre = 'Fantasma';
            break;
        case 'steel':
            nombre = 'Acero';
            break;
        case 'fire':
            nombre = 'Fuego';
            break;
        case 'water':
            nombre = 'Agua';
            break;
        case 'grass':
            nombre = 'Planta';
            break;
        case 'electric':
            nombre = 'Eléctrico';
            break;
        case 'psychic':
            nombre = 'Psíquico';
            break;
        case 'ice':
            nombre = 'Hielo';
            break;
        case 'dragon':
            nombre = 'Dragon';
            break;
        case 'dark':
            nombre = 'Siniestro';
            break;
        case 'fairy':
            nombre = 'Hada';
            break;
        case 'stellar':
            nombre = 'Stellar';
            break;
        case 'unknow':
            nombre = '???';
            break;
        case 'shadow':
            nombre = 'Ombra';
            break;
    }

    return nombre;

}

/**
 * Funcion que carga las generaciones con sus datos
 * 
 */
async function cargarDatosGeneracion(pokemons, tipos) {
    try {
        let lista = [];

        const generaciones = await cargarGeneraciones();

        for (let generacion of generaciones.results) {
            let name = generacion.name;

            const result = await cargarInfoGeneracion(name);

            let listaPokemon = [];

            result.pokemon_species.forEach(pokemon => {
                listaPokemon.push(pokemon.name);
            });

            let listaTipos = [];

            result.types.forEach(tipo => {
                listaTipos.push(tipo.name);
            })

            let objGeneracion = {};
            objGeneracion.id = result.id;
            objGeneracion.name = result.name;
            objGeneracion.nombre = result.names[5].name;
            objGeneracion.region = result.main_region.name;
            objGeneracion.pokemons = obtenerIDPokemonsGeneracion(pokemons, listaPokemon);
            objGeneracion.tipos = obtenerIDTiposGeneracion(tipos, listaTipos);

            lista.push(objGeneracion);
        }

        return lista;
    } catch (error) {
        console.error('Error loading generations:', error);
    }
}


/**
 * 
 * @param {int} offset desde donde empieza a cargar en la API
 * @param {int} limit numero de pokemons que carga la API
 * @param {*} cantidad numero de pokemons que troceará con slice
 * @returns 
 */
async function cargarDatosPokemons(offset, limit, cantidad) {
    try {
        let resultado = [];
        let lista = [];
        let lote = [];

        /**Cargo los nombre de los pokemons */
        const result = await cargarPokemon(offset, limit);
        let listaPokemon = result.results;

        /**Los meto en un array */
        for (let pokemon of listaPokemon) {
            lista.push(pokemon.name);
        }

        /**Bucle for para crear los mini-arrays que creo con slice */
        for (let i = 0; i < limit; i += cantidad) {

            /**Empiza desde i hasta i+cantidad*/
            lote = lista.slice(i, i + cantidad);

            /**Guardo las promesas en un array */
            const promesas = lote.map(nombre => cargarInfoPokemon(nombre));

            /**Guarda todos los resultados de la constante promesas en un array */
            const respuestas = await Promise.all(promesas);

            /**Creo un JSON por cada pokemon */
            for (let j = 0; j < lote.length; j++) {

                let objPokemon = {};
                const resp = respuestas[j];
                objPokemon.id = resp.id;
                objPokemon.name = resp.name;
                objPokemon.height = resp.height;
                objPokemon.weight = resp.weight;
                objPokemon.stats = formatearStats(resp.stats);
                objPokemon.types = formatearTypes(resp.types);
                resultado.push(objPokemon);
            }

        }

        return resultado;

    } catch (error) {
        alert(error.message)
    }
}

/**
 * Funcion que carga todos los pokemons
 */
async function cargarListadoPokemon() {
    try {
        let prueba = [];
        let l = 0;

        while (l < 1400) {
            const resp = await cargarDatosPokemons(l, 300, 150);
            resp.forEach(pok => {
                prueba.push(pok);
            })
            l += 300;
        }
        return prueba;
    } catch (error) {
        throw error;
    }
}

function buscarPokemonPorNombre(lista, nombre) {
    let objPokemon = {};

    for (let pokemon of lista) {
        if (pokemon.name === nombre) {
            objPokemon = pokemon;
        }
    }

    return objPokemon;
}

/**
 * Funcion que carga los datos de los tipos de la api
 * @param {Array} listaPokemon 
 * @returns 
 */
async function cargarListadoTipos(listaPokemon) {
    try {
        let listaTipo = [];

        const respuesta = await cargarTipo();

        let tipos = respuesta.results;

        for (let tipo of tipos) {
            const respuestaTipo = await cargarInfoTipo(tipo.name);

            let objTipo = {};
            objTipo.id = respuestaTipo.id;
            /**Obtengo los nombres de los tipos en español */
            objTipo.name = respuestaTipo.name;
            objTipo.nombre = respuestaTipo.names[5].name;
            objTipo.daños = formatearTipoDaño(respuestaTipo.damage_relations);
            objTipo.pokemons = obtenerIDPokemonsTipo(listaPokemon, tipo.name);

            listaTipo.push(objTipo);
        }

        return listaTipo;
    }
    catch (error) {
        alert(error.message);
    }
}

/**
 * Función que compara las lista de pokemons de un tipo con la de pokemons y obtiene sus ids
 * @param {Array} listaPokemon 
 * @param {String} tipoPokemon
 * @returns 
 */
function obtenerIDPokemonsTipo(listaPokemon, tipoPokemon) {
    let listaTipo = {};

    listaPokemon.forEach(pokemon => {

        for (let tipo of pokemon.types) {
            if (tipo.name === tipoPokemon) {
                listaTipo[pokemon.name] = pokemon.id;
            }
        }
    });

    return listaTipo;
}


/**
 * Función que obtiene los ID de los pokemons que pertenecen a una generación
 * Comparando con el listadoTotal de los pokemons y la lista de pokemons que esta dentro de una genracion
 * @param {Array} listaPokemon 
 * @param {Array} listaGeneracionPokemon 
 * @returns 
 */
function obtenerIDPokemonsGeneracion(listaPokemon, listaGeneracionPokemon) {
    let listaGeneracion = {};
    listaPokemon.forEach(pokemon => {
        for (let pokemonGeneracion of listaGeneracionPokemon) {
            if (pokemon.name === pokemonGeneracion) {
                listaGeneracion[pokemonGeneracion] = pokemon.id;
            }
        }

    });

    return listaGeneracion;
}

/**
 * Funcion que obtiene los ID de los tipos que pertenecen a una generacion;
 * @param {Array} listaTipos 
 * @param {Array} listaGeneracionTipos 
 * @returns 
 */
function obtenerIDTiposGeneracion(listaTipos, listaGeneracionTipos) {
    let listaGeneracion = {};
    listaTipos.forEach(tipo => {
        for (let tipoPokemon of listaGeneracionTipos) {
            if (tipo.name === tipoPokemon) {
                listaGeneracion[tipo.nombre] = tipo.id;
            }
        }

    });

    return listaGeneracion;
}


/**
 * Función que carga los datos, si no existe en la localstorage, carga los datos
 * Pero si ya existe el valor en la localstorage, no vuelve a cargar nada;
 */

async function cargaDatos() {
    try {

        let listaPokemon = [];
        let listaTipos = [];
        let listaGeneracion = [];

        if (!localStorage.getItem('pokemons')) {
            const listado = await cargarListadoPokemon();
            listaPokemon = listado;
            localStorage.setItem('pokemons', JSON.stringify(listaPokemon));
        }

        if (!localStorage.getItem('tipos')) {
            const tipos = await cargarListadoTipos(listaPokemon);
            listaTipos = tipos;
            localStorage.setItem('tipos', JSON.stringify(listaTipos));
        }

        if (!localStorage.getItem('generaciones')) {
            const generaciones = await cargarDatosGeneracion(listaPokemon, listaTipos);
            listaGeneracion = generaciones;
            localStorage.setItem('generaciones', JSON.stringify(listaGeneracion));
        }

    } catch (error) {
        console.error(error);
    }
}

/** 
 *  Al cargar la página ejecuta la carga de datos que se almacenará en la localstorage
 */
window.addEventListener("load", function () {
    cargaDatos();
})

