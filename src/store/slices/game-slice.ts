import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import axios from "axios";
import TronWeb from 'tronweb';
import { NILE_TESTNET } from "../../constants/addresses";

interface IloadgameDetails {
  account: any;
}
declare var window: any

export const loadGameDetails = createAsyncThunk(
  "app/loadGameDetails",
  //@ts-ignore
  async ({ account }: IloadgameDetails ) => {
    let meowContract, nftContract, meowTokenContract;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb.contract().at(TronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
        nftContract = await window.tronWeb.contract().at(TronWeb.address.toHex(NILE_TESTNET.NFT_ADDRESS));
        meowTokenContract = await window.tronWeb.contract().at(TronWeb.address.toHex(NILE_TESTNET.MEOWTOKEN_ADDRESS));
      }
    }

    let gameData: any[] = [];
    let randomData: any[] = [];
    let resultData: any[] = [];
    let winnerData: any[] = [];
    let nftids: any[] = [];
    let nfturls: any[] = [];
    let nfturis: any[] = [];
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
    console.log("loadgamedetail");
    
    const gameprice = ((await meowContract.gamePrice().call())).toString();
    const jackpotAmount = ((await meowContract.jackpotAmount().call()) / Math.pow(10, 6)).toString();
    const meowCount = (await meowTokenContract.balanceOf(account).call()).toString();
    const contractNFTCount = await meowContract.tokenOwnerLength(account).call();
    const nft_counts = await nftContract.balanceOf(account).call();
    for(let i = 0; i < Math.min(nft_counts, 4); i ++) {
      let tmptokenID = await nftContract.tokenOfOwnerByIndex(account, i).call();
      nftids[i] = TronWeb.toDecimal(tmptokenID)
    }

    for(let i = 0; i < Math.min(nft_counts, 4); i ++) {
      nfturls[i] = await nftContract.tokenURI(nftids[i]).call();
    }

    for(let i = 0; i < Math.min(nft_counts, 4); i ++) {
      nfturis[i] = `https://ipfs.io/ipfs/${nfturls[i].slice(7, 53)}/${nftids[i]}.png`
    }
    let contractNFTs = 0;
    for(let i = contractNFTCount - 1; i >= 0 ; i --) {
      let tmp = await meowContract.tokenOwner(account, i).call();
      if(tmp == 0) break;
      contractNFTs ++;
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
      meowCount,
      contractNFTs,
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
  widrawAmount: number;
  meowCount: string;
  contractNFTs: number;
}

const gameSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGameDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadGameDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadGameDetails.rejected, (state) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gameSlice.reducer;

export const { fetchAppSuccess } = gameSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
