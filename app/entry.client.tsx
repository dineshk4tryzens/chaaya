/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, Suspense, useEffect, useMemo, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import createEmotionCache from "./src/createEmotionCache";
import ClientStyleContext from "./src/ClientStyleContext";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AvertaTTF from "../app/styles/fonts/Averta-Regular.ttf";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  useEffect(() => {
    // Reset the cache only on the client side
    setCache(createEmotionCache());
  }, []);

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    [],
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}
// startTransition(() => {
//   hydrateRoot(
//     document,
//     <StrictMode>
//       <RemixBrowser />
//     </StrictMode>
//   );
// });

const theme = createTheme({
  typography: {
    fontFamily: "Averta, Arial",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body: {
          height: 100vh;
        }
        @font-face {
          font-family: 'Averta';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Averta'), local('Averta-Regular'), url(${AvertaTTF}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <ClientCacheProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <StrictMode>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
              <RemixBrowser />
            {/* </Suspense> */}
          </StrictMode>
        </ThemeProvider>
      </ClientCacheProvider>,
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
