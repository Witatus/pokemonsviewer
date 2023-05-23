"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPokemon = exports.getPokemonByNameOrId = exports.getAllPokemons = void 0;
const Pokemon_1 = require("../models/Pokemon");
function isNumeric(value) {
    return /^\d+$/.test(value);
}
const getAllPokemons = async (_req, res) => {
    try {
        const pokemons = await Pokemon_1.Pokemon.find();
        res.status(200).json(pokemons);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving pokemons", error });
    }
};
exports.getAllPokemons = getAllPokemons;
const getPokemonByNameOrId = async (req, res) => {
    try {
        if (isNumeric(req.params.value)) {
            const pokemon = await Pokemon_1.Pokemon.findOne({ pokeId: req.params.value });
            res.status(200).json(pokemon);
        }
        else {
            const pokemon = await Pokemon_1.Pokemon.findOne({ name: req.params.value });
            res.status(200).json(pokemon);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving this pokemon", error });
    }
};
exports.getPokemonByNameOrId = getPokemonByNameOrId;
const addPokemon = async (req, res) => {
    const newPokemon = new Pokemon_1.Pokemon(req.body);
    try {
        const savedPokemon = await newPokemon.save();
        res.status(201).json(savedPokemon);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding pokemon", error });
    }
};
exports.addPokemon = addPokemon;
