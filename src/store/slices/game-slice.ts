import { setAll } from "../../helpers/set-all";
import tronWeb from 'tronweb';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import axios from "axios";

export const loadGameDetails = createAsyncThunk(
  "app/loadGameDetails",
  //@ts-ignore
  async () => {
    let meowContract = await tronWeb.contract().at('TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M');
    // const meowContract = new ethers.Contract(
    //   addresses.MEOW_ADDRESS,
    //   meowContractABI,
    //   provider
    // );
    console.log('Here is game details');
    
    let gameData: any[] = [];
    let randomData: any[] = [];
    let resultData: any[] = [];
    let winnerData: any[] = [];

    await axios.get(`http://192.168.106.175:8001/api/betting`).then((res) => {
      gameData = res.data;
    });
    await axios.get(`http://192.168.106.175:8001/api/random`).then((res) => {
      randomData = res.data;
    });
    await axios.get(`http://192.168.106.175:8001/api/result`).then((res) => {
      resultData = res.data;
    });
    await axios.get(`http://192.168.106.175:8001/api/winner`).then((res) => {
      winnerData = res.data;
    });

    const gameprice = (
      (await meowContract.gamePrice().call()) / Math.pow(10, 18)
    ).toString();
    const jackpotAmount = (
      (await meowContract.jackpotAmount().call()) / Math.pow(10, 18)
    ).toString();

    console.log("GamePrice:  ", gameprice);

    return {
      gameprice,
      jackpotAmount,
      gameData,
      randomData,
      resultData,
      winnerData,
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
