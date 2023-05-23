import PokemonDetailedCard from "@/features/Pokemons/components/PokemonDetailedCard";
import { useRouter } from "next/dist/client/router";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import Sidebar from "@/features/Navigation/components/Sidebar";

export default function Pokemon() {
  const router = useRouter();
  const name = router.query.slug;

  if (typeof name !== "string") {
    return;
  }

  return (
    <>
      <RemoveScrollBar />
      <Sidebar />
      <PokemonDetailedCard name={name} />
    </>
  );
}
