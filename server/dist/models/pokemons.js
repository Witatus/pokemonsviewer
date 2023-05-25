"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
const mongoose_1 = require("mongoose");
const PokemonSchema = new mongoose_1.Schema({
    pokeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    types: { type: (Array), required: true },
    sprite_front_default: { type: String, required: true },
    description: { type: String, required: true },
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    special_attack: { type: Number, required: true },
    special_defense: { type: Number, required: true },
    speed: { type: Number, required: true },
});
PokemonSchema.index({ name: 1 }, { unique: true });
exports.Pokemon = (0, mongoose_1.model)("Pokemon", PokemonSchema, "pokemonsCollection");
