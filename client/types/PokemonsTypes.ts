export type PokemonType = {
  name: string;
  sprite_front_default: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  types: Array<string>;
};

export type StateType = {
  pokemons: Array<PokemonType>;
  loading: string;
  numberOfPokemonsFetched: number;
};

export interface SearchParams {
  howManyToFetch: number;
  params: {
    filters: string[];
    sortBy: string;
    order: string;
    requireAll: boolean;
  };
}

export interface SearchBarProps {
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
}

export interface FilterSortSettings {
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
}
export interface PokemonsFacadeProps {
  searchParams: SearchParams;
}

export interface Params {
  filters: string[];
  sortBy: string;
  order: string;
  requireAll: boolean;
}

export interface SearchParams {
  params: Params;
}

export enum PokemonStats {
  pokeId = "PokeId",
  hp = "Hp",
  attack = "Attack",
  defense = "Defense",
  special_attack = "Special Attack",
  special_defense = "Special Defense",
  speed = "Speed",
}

export   enum ElementTypes {
  Normal = "Normal",
  Fire = "Fire",
  Water = "Water",
  Grass = "Grass",
  Flying = "Flying",
  Fighting = "Fighting",
  Poison = "Poison",
  Electric = "Electric",
  Ground = "Ground",
  Rock = "Rock",
  Psychic = "Psychic",
  Ice = "Ice",
  Bug = "Bug",
  Ghost = "Ghost",
  Steel = "Steel",
  Dragon = "Dragon",
  Dark = "Dark",
  Fairy = "Fairy",
}