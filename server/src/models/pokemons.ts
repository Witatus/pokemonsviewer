import { Document, Schema, model } from "mongoose";
import { ElementType } from "../types/pokemonTypes";

export interface IPokemon extends Document {
  pokeId: Number;
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
}

const PokemonSchema: Schema = new Schema(
  {
    pokeId: { type: Number, required: true, unique: true},
    name: { type: String, required: true },
    types: { type: Array<ElementType>, required: true },
    sprite_front_default: { type: String, required: true },
    description: { type: String, required: true },
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    special_attack: { type: Number, required: true },
    special_defense: { type: Number, required: true },
    speed: { type: Number, required: true },
  }
);
PokemonSchema.index({ name: 1 }, { unique: true });

export const Pokemon = model<IPokemon>(
  "Pokemon",
  PokemonSchema,
  "pokemonsCollection"
);
