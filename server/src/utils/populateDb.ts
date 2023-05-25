import { ElementType } from "../types/pokemonTypes";
import {Pokemon} from "../models/pokemons";

type PokemonType = {
  pokeId: number;
  name: string;
  types: Array<ElementType>;
  sprite_front_default: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function extractPokeId(url: string) {
  const id = url.split("/")[6];
  return parseInt(id);
}

export const fetchOriginalPokemons = async () => {

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0}`
  );
  const pokemonsList = await response.json();

  for (let i = 0; i < pokemonsList.count; i += 100) {

    const data = pokemonsList.results.slice(i,i+100)
    const pokemonsPromiseArray = await data.map(
      (value: { url: string }) => fetch(value.url)
    );
    
    const pokeIdsArray = data.map((value: { url: string }) => extractPokeId(value.url))

    const pokemonsResponseArray = await Promise.all(pokemonsPromiseArray);
    const pokemonsResponseJsonArray = pokemonsResponseArray.map(
      async (value) => await value.json()
    );
    const pokemonsResultsArray = await Promise.all(pokemonsResponseJsonArray);

    const speciesPromiseArray = pokemonsResultsArray.map((value) =>
      fetch(value.species.url)
    );
    const speciesResponseArray = await Promise.all(speciesPromiseArray);
    const speciesResponseJsonArray = speciesResponseArray.map(
      async (value) => await value.json()
    );
    const speciesResultsArray = await Promise.all(speciesResponseJsonArray);
    let output: PokemonType[] = [];

    const getDescription = (data: { flavor_text_entries: any }) => {
      let decscription = "------";
      for (const entry of data.flavor_text_entries) {
        if (entry.language.name === "en" && entry.flavor_text) {
          decscription = entry.flavor_text.replace("\f", " ");
          break;
        }
      }
      return decscription;
    };

    pokemonsResultsArray.forEach((value, index) => {
      output.push({
        pokeId: pokeIdsArray[index],
        name: capitalizeFirstLetter(value.name),
        types: value.types.map( (val : {type : {name : string}}) =>  capitalizeFirstLetter(val.type.name)),
        sprite_front_default: value.sprites.front_default || value.sprites.front_shiny || "no image",
        description: getDescription(speciesResultsArray[index]),
        hp: value.stats[0].base_stat,
        attack: value.stats[1].base_stat,
        defense: value.stats[2].base_stat,
        special_attack: value.stats[3].base_stat,
        special_defense: value.stats[4].base_stat,
        speed: value.stats[5].base_stat,
      });
    });

    Pokemon.insertMany(output);
    console.log(`Inserted ${output.length} pokemons`)
  }
};
