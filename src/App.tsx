import { Route, Switch, Redirect } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Header from "components/Header";
import Home from "pages/Home";
import Stake from "pages/Stake";
import Admin from "pages/admin";
import Result from "pages/result";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./state";
import { loadGameDetails } from "./store/slices/game-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { loadJackpotDetails } from "store/slices/jackpot-slice";
import { loadRandomDetails } from "store/slices/random-slice";
import { loadResultDetails } from "store/slices/result-slice";
import { loadWinnerDetails } from "store/slices/winner-slice";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { useWalletModalToggle } from "state/application/hooks";
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { loadWaitingDetails } from "store/slices/getnft-slice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { active, account } = useWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  const loadData = useCallback(() => {
    dispatch(loadGameDetails({ gameData: [] }));
    dispatch(loadRandomDetails({ randomData: [] }));
    dispatch(loadResultDetails({
      resultData: [],
      myResultData: [],
      address: account,
    }));
    dispatch(loadWinnerDetails({ winnerData: [] }));
    dispatch(loadWaitingDetails({
      waitingList: [],
      approvedList: []
    }));
    dispatch(loadNftDetails({ account: account }));
    dispatch(loadJackpotDetails({ account: account }));
  }, [account]);

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
        <ReactNotifications />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/stake" component={Stake} />
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/result' component={Result} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Provider>
    </>
  );
}

export default App;
