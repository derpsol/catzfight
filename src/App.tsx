import { Route, Switch, Redirect } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Header from "components/Header";
import Home from "pages/Home";
import Stake from "pages/Stake";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./state";
import { loadGameDetails } from "./store/slices/game-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { useWalletModalToggle } from "state/application/hooks";
import Messages from "components/Messages";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { active, account } = useWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  const loadData = useCallback(() => {
    dispatch(loadGameDetails({ account: account }));
    dispatch(loadNftDetails({ account: account }));
  }, [active]);

  useEffect(() => {
    if (active) {
      loadData();
    }
  }, [active]);
  useEffect(() => {
    if (!active) {
      toggleWalletModal();
    }
  }, [active]);

  return (
    <>
      <Provider store={store}>
        <Header />
        <Messages />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/stake" component={Stake} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Provider>
    </>
  );
}

export default App;
