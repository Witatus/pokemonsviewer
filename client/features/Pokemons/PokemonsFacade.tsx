import React from "react";
import type { PokemonType } from "../../types/PokemonsTypes";
import { fetchPokemons, selectAllPokemons } from "./pokemonSlice";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import Grid from "@mui/material/Grid";
import PokemonOverviewCard from "./components/PokemonOverviewCard";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { PokemonsFacadeProps } from "../../types/PokemonsTypes";
import Loading from "../Utils/Loading";

export const PokemonsFacade: React.FC<PokemonsFacadeProps> = ({
  searchParams,
}) => {
  const dispatch = useAppDispatch();
  const pokemons = useAppSelector<PokemonType[]>(selectAllPokemons);

  const handleOnDocumentBottom = () => {
    dispatch(fetchPokemons({ params: searchParams.params }));
  };

  if (!pokemons || pokemons.length === 0) {
    return (
      <>
        <Grid container justifyContent="center">
          <Loading />
        </Grid>
      </>
    );
  }
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
