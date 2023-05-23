import { useSession } from "next-auth/react";
import { useState } from "react";
import { SearchParams } from "@/types/PokemonsTypes";
import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function Home({}) {
  // const [searchParams, setSearchParams] = useState<SearchParams>({howManyToFetch: 30, params: {filters: [], sortBy: "pokeId", order: "Ascending", requireAll: false}});
  const { data: session, status } = useSession();
  console.log("session", session);
  console.log("status", status);
  const router = useRouter();
  
  useEffect(() => {
    router.push('/pokemons/browse');
  }, [router]);

  return (<></>)
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/pokemons/browse',
      permanent: false,
    }
  }
}