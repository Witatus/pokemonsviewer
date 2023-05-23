import React from 'react';
import {PokemonsFacade} from "@/features/Pokemons/PokemonsFacade";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "@/features/Navigation/components/Sidebar";
import SearchBar from "@/features/Navigation/components/SearchBar";
import { useState } from "react";
import { SearchParams } from "@/types/PokemonsTypes";

const Browse: React.FC = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({howManyToFetch: 30, params: {filters: [], sortBy: "pokeId", order: "Ascending", requireAll: false}});
  
    return (
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <SearchBar setSearchParams={setSearchParams} />
            <Toolbar />
            <PokemonsFacade searchParams={searchParams}  />
          </Box>
        </Box>
    );
};

export default Browse;