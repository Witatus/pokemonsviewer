import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function Home({}) {
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