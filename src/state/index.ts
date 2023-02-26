import { configureStore } from "@reduxjs/toolkit";
import { load } from "redux-localstorage-simple";

import application from "./application/reducer";
import { updateVersion } from "./global/actions";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import multicall from "./multicall/reducer";

import appReducer from "../store/slices/game-slice";
import fightReducer from "../store/slices/play-slice";
import stackReducer from "../store/slices/staking-slice";
import nftReducer from "../store/slices/NFt-slice";
  
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
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
