import { configureStore } from "@reduxjs/toolkit";
import { load } from "redux-localstorage-simple";

import application from "./application/reducer";
import { updateVersion } from "./global/actions";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import multicall from "./multicall/reducer";

import appReducer from "store/slices/game-slice";
import fightReducer from "store/slices/play-slice";
import stackReducer from "store/slices/staking-slice";
import nftReducer from "store/slices/NFt-slice";
import nftInfoReducer from 'store/slices/Nftinfo-slice';
import walletInfoReducer from 'store/slices/walletInfo-slice';
import messagesReducer from "store/slices/messages-slice";
import battleReducer from 'store/slices/battle-slice';
import JackpotReducer from 'store/slices/jackpot-slice';
import RandomReducer from 'store/slices/random-slice';
import ResultReducer from 'store/slices/result-slice';
import WinnerReducer from 'store/slices/winner-slice';
import WaitingReducer from 'store/slices/getnft-slice';

const PERSISTED_KEYS: string[] = ["user", "transactions", "lists"];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    multicall,
    app: appReducer,
    fight: fightReducer,
    stack: stackReducer,
    nft: nftReducer,
    nfts: nftInfoReducer,
    wallet: walletInfoReducer,
    messages: messagesReducer,
    battle: battleReducer,
    jackpot: JackpotReducer,
    random: RandomReducer,
    result: ResultReducer,
    winner: WinnerReducer,
    waiting: WaitingReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
