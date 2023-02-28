import { setAll } from "../../helpers/set-all";
import TronWeb from 'tronweb';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import axios from "axios";

interface IloadgameDetails {
  account: any;
}

export const loadGameDetails = createAsyncThunk(
  "app/loadGameDetails",
  //@ts-ignore
  async ({account}: IloadgameDetails, {dispatch}) => {
    const fullNode = "https://nile.trongrid.io";
    const solidityNode = "https://nile.trongrid.io";
    const eventServer = "https://nile.trongrid.io";
    const privateKey = "f40377da14d42e691ca51d43ea2a3177bfce04201a9ba2dd997e8e38c694722a";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    let meowContract, nftContract;
    Promise.all([
      meowContract = await tronWeb.contract().at('TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M'),
      nftContract = await tronWeb.contract().at('TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4')
    ]);
    
    let gameData: any[] = [];
    let randomData: any[] = [];
    let resultData: any[] = [];
    let winnerData: any[] = [];
    let nftids: any[] = [];
    let nfturls: any[] = [];
    let nfturis: any[] = [];
    await axios.get(`http://173.249.54.208/api/betting`).then((res) => {
      gameData = res.data;
    });
    await axios.get(`http://173.249.54.208/api/random`).then((res) => {
      randomData = res.data;
    });
    await axios.get(`http://173.249.54.208/api/result`).then((res) => {
      resultData = res.data;
    });
    await axios.get(`http://173.249.54.208/api/winner`).then((res) => {
      winnerData = res.data;
    });
    console.log("Finished axios requests");

    const gameprice = (
      (await meowContract.gamePrice().call()) / Math.pow(10, 6)
    ).toString();
    const jackpotAmount = (
      (await meowContract.jackpotAmount().call()) / Math.pow(10, 6)
    ).toString();
    const nft_counts = await nftContract.balanceOf(account).call();

    for(let i = 0; i < nft_counts; i ++) {
      let tmptokenID = await nftContract.tokenOfOwnerByIndex(account, i).call();
      nftids[i] = tronWeb.toDecimal(tmptokenID)
    }

    for(let i = 0; i < nft_counts; i ++) {
      nfturls[i] = await nftContract.tokenURI(nftids[i]).call();
    }

    for(let i = 0; i < nft_counts; i ++) {
      nfturis[i] = `https://ipfs.io/ipfs/${nfturls[i].slice(7, 53)}/${nftids[i]}.png`
    }

    return {
      gameprice,
      jackpotAmount,
      gameData,
      randomData,
      resultData,
      winnerData,
      nftids,
      nfturis,
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
  nftids: any[];
  nfturis: any[];
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
