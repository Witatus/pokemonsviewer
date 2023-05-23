import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Collapse } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterSortSettings from "./FilterSortSettings";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../../hooks/useDebounce";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import {
  fetchSearchedPokemons,
  fetchPokemons,
  resetState,
} from "../../Pokemons/pokemonSlice";
import { SearchBarProps } from "../../../types/PokemonsTypes";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  flexGrow: 1,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  flexGrow: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    flexGrow: 1,
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({ setSearchParams  }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useAppDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(resetState());
      dispatch(fetchSearchedPokemons({ searchTerm: debouncedSearchTerm }));
    }
    if (debouncedSearchTerm === "") {
      // console.log("dupaaaaaaaaa");
      dispatch(resetState());
      dispatch(fetchPokemons({}));
    }
  }, [debouncedSearchTerm, dispatch]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={handleSearchChange}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <IconButton color="inherit" onClick={toggleSettings}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
        <Collapse in={showSettings}>
          <FilterSortSettings setSearchParams={setSearchParams}/>
        </Collapse>
      </AppBar>
    </>
  );
};

export default SearchBar;
