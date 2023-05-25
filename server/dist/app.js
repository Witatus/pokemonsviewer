"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const pokemonRoutes_1 = require("./routes/pokemonRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const usersAuthRoutes_1 = require("./routes/usersAuthRoutes");
const passport_1 = __importDefault(require("./config/passport"));
const passport_2 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const authentication_1 = require("./utils/authentication");
(0, database_1.setupDatabase)(process.env.DATABASE_URL || "mongodb://localhost/pokemon");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, passport_1.default)(passport_2.default);
app.use(passport_2.default.initialize());
const whitelist = ['http://localhost:3000'];
app.options('*', (0, cors_1.default)());
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use("/api/pokemons", pokemonRoutes_1.pokemonsRouter);
app.use("/api/auth", usersAuthRoutes_1.usersAuthRouter);
app.use("/api/users", userRoutes_1.usersRouter);
// fetchOriginalPokemons();
(0, authentication_1.clearBlacklist)();
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
