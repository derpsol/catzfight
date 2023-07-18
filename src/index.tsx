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
import reportWebVitals from "./reportWebVitals";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <ThemeProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </ThemeProvider>,

  document.getElementById("root") as HTMLElement
);

reportWebVitals();
