import React from "react";
import type { PokemonType } from "../../types/PokemonsTypes";
import {
  fetchPokemons,
  selectAllPokemons,
  selectFilters,
  selectRequireAllFilters,
} from "./pokemonSlice";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import { resetState } from "./pokemonSlice";
import Grid from "@mui/material/Grid";
import PokemonOverviewCard from "./components/PokemonOverviewCard";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { useSession} from "next-auth/react";
import { useEffect } from "react";
import { PokemonsFacadeProps } from "../../types/PokemonsTypes";

export const PokemonsFacade: React.FC<PokemonsFacadeProps> = ({
  searchParams,
}) => {
  const dispatch = useAppDispatch();
  const pokemons = useAppSelector<PokemonType[]>(selectAllPokemons);
  const { data: session } = useSession();

  const handleOnDocumentBottom = () => {
    console.log("bottom", searchParams.params);
    dispatch(fetchPokemons({ params: searchParams.params }));
  };

  // if (!pokemons || pokemons.length === 0) {
  //   return null;
  // }

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {pokemons.map((pokemon: PokemonType) => {
          return <PokemonOverviewCard key={pokemon.name} name={pokemon.name} />;
        })}
      </Grid>
      <BottomScrollListener onBottom={handleOnDocumentBottom} />
    </>
  );
};
