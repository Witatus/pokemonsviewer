"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = exports.elementType = void 0;
const mongoose_1 = require("mongoose");
var elementType;
(function (elementType) {
    elementType[elementType["Normal"] = 0] = "Normal";
    elementType[elementType["Fire"] = 1] = "Fire";
    elementType[elementType["Water"] = 2] = "Water";
    elementType[elementType["Grass"] = 3] = "Grass";
    elementType[elementType["Flying"] = 4] = "Flying";
    elementType[elementType["Fighting"] = 5] = "Fighting";
    elementType[elementType["Poison"] = 6] = "Poison";
    elementType[elementType["Electric"] = 7] = "Electric";
    elementType[elementType["Ground"] = 8] = "Ground";
    elementType[elementType["Rock"] = 9] = "Rock";
    elementType[elementType["Psychic"] = 10] = "Psychic";
    elementType[elementType["Ice"] = 11] = "Ice";
    elementType[elementType["Bug"] = 12] = "Bug";
    elementType[elementType["Ghost"] = 13] = "Ghost";
    elementType[elementType["Steel"] = 14] = "Steel";
    elementType[elementType["Dragon"] = 15] = "Dragon";
    elementType[elementType["Dark"] = 16] = "Dark";
    elementType[elementType["Fairy"] = 17] = "Fairy";
})(elementType = exports.elementType || (exports.elementType = {}));
const PokemonSchema = new mongoose_1.Schema({
    pokeId: { type: Number, required: true },
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
