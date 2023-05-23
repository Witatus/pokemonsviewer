import { Router } from "express";
import * as pokemonController from "../controllers/pokemonsController";
const router = Router();

router.get("/", pokemonController.getAllPokemons);
router.get("/list", pokemonController.getPokemonsListWthOffsetAndLimit);
router.get("/filterSort", pokemonController.getPokemonsByFiltersAndSort);

router.post("/", pokemonController.addPokemon);
router.get("/search/:searchTerm", pokemonController.getPokemonsByTerm);
router.get("/:value", pokemonController.getPokemonByNameOrId);

export { router as pokemonsRouter };
