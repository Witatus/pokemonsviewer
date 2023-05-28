import { Request, Response } from "express";
import { Pokemon, IPokemon } from "../models/pokemons";
import { ElementType } from "../types/pokemonTypes";

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export const getAllPokemons = async (_req: Request, res: Response) => {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemons", error });
  }
};

export const getPokemonsListWthOffsetAndLimit = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.query.offset || !req.query.limit) {
      res.status(400).json({ message: "Offset and limit are required" });
    }

    const offset = parseInt(req.query.offset as string, 10) + 1;
    const upperLimit = parseInt(req.query.limit as string, 10) + offset;
    const pokemons = await Pokemon.find({
      pokeId: { $gte: offset, $lt: upperLimit },
    });
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemons", error });
  }
};

export const getPokemonByNameOrId = async (req: Request, res: Response) => {
  try {
    if (isNumeric(req.params.value)) {
      const pokemon = await Pokemon.findOne({ pokeId: req.params.value });
      res.status(200).json(pokemon);
    } else {
      const pokemon = await Pokemon.findOne({ name: req.params.value });
      res.status(200).json(pokemon);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving this pokemon", error });
  }
};

export const getPokemonsByTerm = async (req: Request, res: Response) => {
  try {
    const pokemons = await Pokemon.find({
      name: new RegExp(("^" + req.params.searchTerm) as string, "i"),
    });
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemons", error });
  }
};

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

export const getPokemonsByFiltersAndSort = async (
  req: Request,
  res: Response
) => {
  let types: string[] | string =
    typeof req.query.filters === "undefined"
      ? []
      : (req.query.filters as string | string[]);
  let order: string = (req.query.order as string) || "Ascending";
  let sortBy: string = (req.query.sortBy as string) || "pokeId";
  let requireAll = req.query.requireAll === "true";
  const alreadyFetched = Number(req.query.alreadyFetched) || 0;
  let query: any = {};

  if ( types.length > 0) {
    if (typeof types === "string") {
      types = [types];
    }

    for (const type of types) {
      if (!Object.values(ElementType).includes(type as ElementType)) {
        res.status(500).json({ message: `Invalid type: ${type}` });
        return;
      }
    }
    if (requireAll) {
      query = { types: { $all: types } };
    } else {
      query = { types: { $in: types } };
    }
  }

  if (
    order === undefined ||
    !["Ascending", "Descending"].includes(order)
  ) {
    res.status(500).json({ message: `Invalid sort option: ${order}` });
    return;
  }
  const sortValue = order === "Descending" ? -1 : 1;

  if (!validSortFields.includes(sortBy)) {
    res.status(500).json({ message: `Invalid sort field: ${sortBy}` });
    return;
  }

  try {
    const pokemons = await Pokemon.find(query)
      .skip(alreadyFetched)
      .sort({ [sortBy]: sortValue })
      .limit(20);
    res.status(200).json(pokemons);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemons", error });
  }
};

export const addPokemon = async (req: Request, res: Response) => {
  const newPokemon: IPokemon = new Pokemon(req.body);

  try {
    const savedPokemon = await newPokemon.save();
    res.status(201).json(savedPokemon);
  } catch (error) {
    res.status(500).json({ message: "Error adding pokemon", error });
  }
};
