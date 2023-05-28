import mongoose from "mongoose";
import { Pokemon } from "../models/pokemons";
import { User } from "../models/user";
import { BlacklistedToken } from "../models/auth";

export const connectToDatabase = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error: any) {
    console.error(`Database connection failed: ${error.message}`);
  }
};

export const createCollections = async () => {
  const collectionNames = Object.keys(mongoose.connection.collections);
  
  if (!collectionNames.includes("pokemonsCollection")) {
    await Pokemon.init();
  }

  if (!collectionNames.includes("usersCollection")) {
    await User.init();
  }

  if (!collectionNames.includes("blacklistedTokensCollection")) {
    await BlacklistedToken.init();
  }
};


export const setupDatabase = async (url: string) => {
  await connectToDatabase(url);
  await createCollections();
};