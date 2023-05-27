import React, { useEffect, useState } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  OutlinedInput,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { fetchPokemons, resetState } from "../../Pokemons/pokemonSlice";
import { FilterSortSettings } from "../../../types/PokemonsTypes";
import { SelectChangeEvent } from "@mui/material/Select";
import { PokemonStats, ElementTypes } from "../../../types/PokemonsTypes";

const FilterSortSettings: React.FC<FilterSortSettings> = ({
  setSearchParams,
}) => {
  const [filter, setFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("pokeId");
  const [order, setOrder] = useState("Ascending");
  const [requireAll, setRequireAll] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSearchParams({
      howManyToFetch: 30,
      params: {
        filters: filter,
        sortBy: sortBy,
        order: order,
        requireAll: requireAll,
      },
    });
    dispatch(resetState());
    dispatch(
      fetchPokemons({
        params: {
          filters: filter,
          sortBy: sortBy,
          order: order,
          requireAll: requireAll,
        },
      })
    );
  }, [filter, sortBy, order, requireAll, setSearchParams, dispatch]);

  const handleFilterChange = (event: SelectChangeEvent<string[]>) => {
    setFilter(event.target.value as string[]);
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as string);
  };

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setOrder(event.target.value as string);
  };

  const handleRequireAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequireAll(event.target.checked);
  };

  return (
    <Box sx={{ mt: 2, p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Select
              labelId="filter-label"
              multiple
              value={filter}
              onChange={handleFilterChange}
              input={<OutlinedInput label="Filter" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              sx={{ mr: 2, minWidth: "90%" }}
            >
              {Object.values(ElementTypes).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={filter.length === 0}
                  onChange={handleRequireAllChange}
                />
              }
              label="Require all"
            />
          </Box>
        </FormControl>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="sortby-label">Sort By</InputLabel>
            <Select
              labelId="sortby-label"
              value={sortBy}
              onChange={handleSortByChange}
              input={<OutlinedInput label="Sort By" />}
            >
              {Object.entries(PokemonStats).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="order-label">Order</InputLabel>
            <Select
              labelId="order-label"
              value={order}
              onChange={handleOrderChange}
              input={<OutlinedInput label="Order" />}
            >
              <MenuItem value="Ascending">Ascending</MenuItem>
              <MenuItem value="Descending">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Box>
  );
};

export default FilterSortSettings;
