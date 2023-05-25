import { fetchOriginalPokemons } from "./utils/populateDb";
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { setupDatabase } from "./config/database";
import { pokemonsRouter } from "./routes/pokemonRoutes";
import { usersRouter } from "./routes/userRoutes";
import { usersAuthRouter } from "./routes/usersAuthRoutes";
import initializePassport from "./config/passport";
import passport from "passport";
import cors from "cors";
import { clearBlacklist } from './utils/authentication';

setupDatabase(process.env.DATABASE_URL || "mongodb://localhost/pokemon");
const app = express();

app.use(express.json());

initializePassport(passport);
app.use(passport.initialize());

const whitelist = ['http://localhost:3000', process.env.FRONTEND_URL]

app.options('*', cors());

const corsOptions = {
  credentials: true,
  origin: (origin : any , callback : any ) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/pokemons", pokemonsRouter);
app.use("/api/auth", usersAuthRouter);
app.use("/api/users", usersRouter);

// fetchOriginalPokemons();
clearBlacklist()
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
