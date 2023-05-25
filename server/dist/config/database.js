"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDatabase = exports.createCollections = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pokemons_1 = require("../models/pokemons");
const user_1 = require("../models/user");
const connectToDatabase = async (url) => {
    try {
        await mongoose_1.default.connect(url);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error(`Database connection failed: ${error.message}`);
    }
};
exports.connectToDatabase = connectToDatabase;
const createCollections = async () => {
    const collectionNames = Object.keys(mongoose_1.default.connection.collections);
    if (!collectionNames.includes("pokemonsCollection")) {
        await pokemons_1.Pokemon.init();
    }
    if (!collectionNames.includes("usersCollection")) {
        await user_1.User.init();
    }
};
exports.createCollections = createCollections;
const setupDatabase = async (url) => {
    await (0, exports.connectToDatabase)(url);
    await (0, exports.createCollections)();
};
exports.setupDatabase = setupDatabase;
