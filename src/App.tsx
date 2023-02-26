import { Route, Switch, Redirect } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Header from "components/Header";
import Home from "pages/Home";
import Stake from "pages/Stake";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./state";
import { loadGameDetails } from "./store/slices/game-slice";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";

// import MiningPoints from "pages/MiningPoints";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { active, account, connector, activate, error } = useWeb3React();

  const loadData = useCallback(() => {
    dispatch(loadGameDetails());
  }, [active]);

  useEffect(() => {
    if (active) {
      loadData();
    }
  }, [active]);

  return (
    <>
      <Provider store={store}>
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
