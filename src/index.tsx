import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "assets/styles/index.scss";
import App from "./App";
import store from "./state";
import ThemeProvider from "./theme";
import getLibrary from "./utils/getLibrary";
import { NetworkContextName } from "./constants";
import { Web3ContextProvider } from "./hooks";
import { SnackbarProvider } from "notistack";
import SnackMessage from "./components/Messages/snackbar";

import reportWebVitals from "./reportWebVitals";
import React from "react";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <ThemeProvider>
    <SnackbarProvider
      disableWindowBlurListener
      maxSnack={4}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      content={(key, message) => {
        const parsedMessage =
          typeof message === "string" ? JSON.parse(message) : message;
        return <SnackMessage id={key} message={parsedMessage} />;
      }}
      autoHideDuration={10000}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Provider store={store}>
            <HashRouter>
              <Web3ContextProvider>
                <App />
              </Web3ContextProvider>
            </HashRouter>
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </SnackbarProvider>
  </ThemeProvider>,

  document.getElementById("root") as HTMLElement
);

reportWebVitals();
