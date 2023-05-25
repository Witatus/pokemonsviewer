import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PokemonType, StateType } from "../../types/PokemonsTypes";
import { AppDispatch, RootState } from "./store";
import { Params } from "../../types/PokemonsTypes";

function buildUrl(
  base: string,
  params: Params,
  alreadyFetched: number
): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (key === "filters" && Array.isArray(value)) {
      value.forEach((filter, index) => {
        url.searchParams.append(key, filter);
      });
    } else {
      url.searchParams.append(key, String(value));
    }
  });
  url.searchParams.append("alreadyFetched", String(alreadyFetched));

  return url.toString();
}

const defaultParams: Params = {
  filters: [],
  sortBy: "pokeId",
  order: "Ascending",
  requireAll: false,
};

export const fetchPokemons = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>()(
  "pokemons/fetchPokemons",
  async (payload: { params?: Params } = {}, thunkAPI) => {
    // console.log("payload params", payload.params)
    const loading = thunkAPI.getState().loading;
    if (loading !== "pending") {
      return;
    }
    payload.params = { ...defaultParams, ...payload.params };

    const url = buildUrl(
      process.env.API_BASE_URL + "/api/pokemons/filterSort",
      payload.params,
      thunkAPI.getState().numberOfPokemonsFetched
    );

    const response = await fetch(url);
    const data = await response.json();

    return { output: data };
  }
);

export const fetchSearchedPokemons = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>()(
  "pokemons/fetchSearchedPokemons",
  async (payload: { searchTerm: string }, thunkAPI) => {
    const loading = thunkAPI.getState().loading;
    if (loading !== "pending") {
      return;
    }
    const response = await fetch(process.env.API_BASE_URL + 
      `/api/pokemons/search/${payload.searchTerm}`
    );
    const data = await response.json();

    return { output: data };
  }
);

const initialState = {
  pokemons: [],
  loading: "idle",
  numberOfPokemonsFetched: 0,
};

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    pokemonAdded(state: StateType, action: PayloadAction<PokemonType[]>) {
      state.pokemons.push(...action.payload);
      state.numberOfPokemonsFetched += 10;
    },
    changeSpecificPokemon(
      state: StateType,
      action: PayloadAction<PokemonType>
    ) {
      state.pokemons[
        state.pokemons.findIndex(
          (el: PokemonType) => el.name === action.payload.name
        )
      ] = action.payload;
    },
    resetState(state: StateType) {
      state.pokemons = [];
      state.numberOfPokemonsFetched = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
        }
      })
      .addCase(fetchPokemons.fulfilled, (state: StateType, action) => {
        if (state.loading === "pending") {
          state.pokemons.push(...action.payload!.output);
          state.numberOfPokemonsFetched = state.pokemons.length;
          state.loading = "idle";
        }
      })
      .addCase(fetchSearchedPokemons.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(fetchSearchedPokemons.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
        }
      })
      .addCase(fetchSearchedPokemons.fulfilled, (state: StateType, action) => {
        if (state.loading === "pending") {
          state.pokemons = action.payload!.output;
          state.loading = "idle";
        }
      });
  },
});

export const { pokemonAdded, changeSpecificPokemon, resetState } =
  pokemonSlice.actions;

export const selectAllPokemons = (state: RootState) => state.pokemons;

export const selectFilters = (state: RootState) => state.filters;

export const selectRequireAllFilters = (state: RootState) =>
  state.requireAllFilters;

export const selectSpecificPokemon = (state: RootState, providedName: string) =>
  state.pokemons.filter(
    (value: { name: string }) => value.name === providedName
  );

export const selectNumberOfPokemonsFetched = (state: RootState) =>
  state.numberOfPokemonsFetched;

export default pokemonSlice.reducer;
