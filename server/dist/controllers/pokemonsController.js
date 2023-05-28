"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPokemon = exports.getPokemonsByFiltersAndSort = exports.getPokemonsByTerm = exports.getPokemonByNameOrId = exports.getPokemonsListWthOffsetAndLimit = exports.getAllPokemons = void 0;
const pokemons_1 = require("../models/pokemons");
const pokemonTypes_1 = require("../types/pokemonTypes");
function isNumeric(value) {
    return /^\d+$/.test(value);
}
const getAllPokemons = async (_req, res) => {
    try {
        const pokemons = await pokemons_1.Pokemon.find();
        res.status(200).json(pokemons);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving pokemons", error });
    }
};
exports.getAllPokemons = getAllPokemons;
const getPokemonsListWthOffsetAndLimit = async (req, res) => {
    try {
        if (!req.query.offset || !req.query.limit) {
            res.status(400).json({ message: "Offset and limit are required" });
        }
        const offset = parseInt(req.query.offset, 10) + 1;
        const upperLimit = parseInt(req.query.limit, 10) + offset;
        const pokemons = await pokemons_1.Pokemon.find({
            pokeId: { $gte: offset, $lt: upperLimit },
        });
        res.status(200).json(pokemons);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving pokemons", error });
    }
};
exports.getPokemonsListWthOffsetAndLimit = getPokemonsListWthOffsetAndLimit;
const getPokemonByNameOrId = async (req, res) => {
    try {
        if (isNumeric(req.params.value)) {
            const pokemon = await pokemons_1.Pokemon.findOne({ pokeId: req.params.value });
            res.status(200).json(pokemon);
        }
        else {
            const pokemon = await pokemons_1.Pokemon.findOne({ name: req.params.value });
            res.status(200).json(pokemon);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving this pokemon", error });
    }
};
exports.getPokemonByNameOrId = getPokemonByNameOrId;
const getPokemonsByTerm = async (req, res) => {
    try {
        const pokemons = await pokemons_1.Pokemon.find({
            name: new RegExp(("^" + req.params.searchTerm), "i"),
        });
        res.status(200).json(pokemons);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving pokemons", error });
    }
};
exports.getPokemonsByTerm = getPokemonsByTerm;
const validSortFields = [
    "pokeId",
    "name",
    "hp",
    "attack",
    "defense",
    "special_attack",
    "special_defense",
    "speed",
];
const getPokemonsByFiltersAndSort = async (req, res) => {
    let types = typeof req.query.filters === "undefined"
        ? []
        : req.query.filters;
    let order = req.query.order || "Ascending";
    let sortBy = req.query.sortBy || "pokeId";
    let requireAll = req.query.requireAll === "true";
    const alreadyFetched = Number(req.query.alreadyFetched) || 0;
    let query = {};
    if (types.length > 0) {
        if (typeof types === "string") {
            types = [types];
        }
        for (const type of types) {
            if (!Object.values(pokemonTypes_1.ElementType).includes(type)) {
                res.status(500).json({ message: `Invalid type: ${type}` });
                return;
            }
        }
        if (requireAll) {
            query = { types: { $all: types } };
        }
        else {
            query = { types: { $in: types } };
        }
    }
    if (order === undefined ||
        !["Ascending", "Descending"].includes(order)) {
        res.status(500).json({ message: `Invalid sort option: ${order}` });
        return;
    }
    const sortValue = order === "Descending" ? -1 : 1;
    if (!validSortFields.includes(sortBy)) {
        res.status(500).json({ message: `Invalid sort field: ${sortBy}` });
        return;
    }
    try {
        const pokemons = await pokemons_1.Pokemon.find(query)
            .skip(alreadyFetched)
            .sort({ [sortBy]: sortValue })
            .limit(20);
        res.status(200).json(pokemons);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving pokemons", error });
    }
};
exports.getPokemonsByFiltersAndSort = getPokemonsByFiltersAndSort;
const addPokemon = async (req, res) => {
    const newPokemon = new pokemons_1.Pokemon(req.body);
    try {
        const savedPokemon = await newPokemon.save();
        res.status(201).json(savedPokemon);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding pokemon", error });
    }
};
exports.addPokemon = addPokemon;
