"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOriginalPokemons = void 0;
const Pokemon_1 = require("../models/Pokemon");
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const fetchOriginalPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=1000}`);
    const pokemonsList = await response.json();
    for (let i = 0; i < pokemonsList.count; i += 100) {
        const data = pokemonsList.results.slice(i, i + 100);
        const pokemonsPromiseArray = await data.map((value) => fetch(value.url));
        const pokemonsResponseArray = await Promise.all(pokemonsPromiseArray);
        const pokemonsResponseJsonArray = pokemonsResponseArray.map(async (value) => await value.json());
        const pokemonsResultsArray = await Promise.all(pokemonsResponseJsonArray);
        const speciesPromiseArray = pokemonsResultsArray.map((value) => fetch(value.species.url));
        const speciesResponseArray = await Promise.all(speciesPromiseArray);
        const speciesResponseJsonArray = speciesResponseArray.map(async (value) => await value.json());
        const speciesResultsArray = await Promise.all(speciesResponseJsonArray);
        let output = [];
        const getDescription = (data) => {
            let decscription = "--";
            for (const entry of data.flavor_text_entries) {
                if (entry.language.name === "en") {
                    decscription = entry.flavor_text.replace("\f", " ");
                    break;
                }
            }
            return decscription;
        };
        pokemonsResultsArray.forEach((value, index) => {
            output.push({
                pokeId: i + index + 1,
                name: capitalizeFirstLetter(value.name),
                types: value.types.map((val) => val.type.name),
                sprite_front_default: value.sprites.front_default || "no image",
                description: getDescription(speciesResultsArray[index]),
                hp: value.stats[0].base_stat,
                attack: value.stats[1].base_stat,
                defense: value.stats[2].base_stat,
                special_attack: value.stats[3].base_stat,
                special_defense: value.stats[4].base_stat,
                speed: value.stats[5].base_stat,
            });
        });
        Pokemon_1.Pokemon.insertMany(output);
        console.log(`Inserted ${output.length} pokemons`);
    }
};
exports.fetchOriginalPokemons = fetchOriginalPokemons;
