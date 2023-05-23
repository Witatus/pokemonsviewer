"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { fetchOriginalPokemons } from "./utils/populateDb";
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const pokemonRoutes_1 = require("./routes/pokemonRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const usersAuth_1 = require("./routes/usersAuth");
(0, database_1.setupDatabase)("mongodb://127.0.0.1:27017/pokemonsDB");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(passport.initialize()); 
// initializePassport(passport);
app.use("/api/pokemons", pokemonRoutes_1.pokemonsRouter);
app.use("api/auth", usersAuth_1.usersAuthRouter);
app.use("/api/users", userRoutes_1.usersRouter);
// fetchOriginalPokemons();
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
