import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import {} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "../features/Pokemons/store";
import { FC } from "react";
import { fetchPokemons } from "../features/Pokemons/pokemonSlice";
import { useEffect } from "react";
import type {} from "redux-thunk/extend-redux";
import { SessionProvider } from "next-auth/react";

const App: FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
  ...rest
}) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  useEffect(() => {
    if (store.getState().numberOfPokemonsFetched == 0) {
      store.dispatch(fetchPokemons({}));
    }
  }, [store]);

  // @ts-ignore
  const persistor = store.__persistor;
  return (
    <>
      <SessionProvider session={session}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </ReduxProvider>
      </SessionProvider>
    </>
  );
};

export default App;
