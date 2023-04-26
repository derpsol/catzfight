import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import axios from "axios";
import TronWeb from "tronweb";
import { SHASTA_TESTNET } from "../../constants/addresses";

interface ILoadGameDetails {
  account: any;
}

declare var window: any;

export const loadGameDetails = createAsyncThunk(
  "app/loadGameDetails",
  async ({ account }: ILoadGameDetails ) => {
    let meowContract, meowTokenContract;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb.contract().at(TronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
        meowTokenContract = await window.tronWeb.contract().at(TronWeb.address.toHex(SHASTA_TESTNET.MEOWTOKEN_ADDRESS));
      }
    }

    let gameData: any[] = [];
    let randomData: any[] = [];
    let resultData: any[] = [];
    let winnerData: any[] = [];

    await axios.get(`http://54.176.107.208/api/betting`).then((res) => {
      gameData = res.data;
    });
    await axios.get(`http://54.176.107.208/api/random`).then((res) => {
      randomData = res.data;
    });
    await axios.get(`http://54.176.107.208/api/result`).then((res) => {
      resultData = res.data;
    });
    await axios.get(`http://54.176.107.208/api/winner`).then((res) => {
      winnerData = res.data;
    });
    const gameprice = ((await meowContract.gamePrice().call())).toString();
    const jackpotAmount = ((await meowContract.jackpotAmount().call()) / Math.pow(10, 6)).toString();
    const meowCount = (await meowTokenContract.balanceOf(account).call()).toString();
    return {
      gameprice,
      jackpotAmount,
      gameData,
      randomData,
      resultData,
      winnerData,
      meowCount,
    };
  }
);

const initialState = {
  loading: true,
  
};

export interface IAppSlice {
  gameprice: string;
  jackpotAmount: string;
  gameData: any[];
  allowflg: boolean;
  currentData: any;
  loading: boolean;
  randomData: any[];
  resultData: any[];
  winnerData: any[];
  widrawAmount: number;
  meowCount: string;
}

const gameSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGameDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadGameDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadGameDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gameSlice.reducer;

export const { fetchAppSuccess } = gameSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
