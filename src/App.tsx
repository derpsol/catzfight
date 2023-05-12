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
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  const loadData = useCallback(() => {
    dispatch(loadGameDetails({ account: account }));
    dispatch(loadNftDetails({ account: account }));
  }, [account]);

  useEffect(() => {
    if (account) {
      loadData();
    }
  }, [account]);
  useEffect(() => {
    if (!account) {
      toggleWalletModal();
    }
  }, [account]);

  return (
    <>
      <Provider store={store}>
        <ReactNotifications />
        <Header />
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
