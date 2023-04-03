import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import axios from "axios";

interface IwalletInfo {
  account: any;
}

export const walletInfo = createAsyncThunk(
  'nft/walletInfo',
  async ({ account }: IwalletInfo) => {
    let tmpData: any;
    await axios
      .get(`http://localhost:8001/api/userinfo/find?address=${account}`)
      .then((res) => {tmpData = res.data});

    let nftCount = tmpData?.ownNfts.length;
    let trxAmount = tmpData?.claimAmount / 1000000;
    return {
      nftCount,
      trxAmount,
    };
  }
)

export interface IWalletInfoDetail {
  nftCount: number;
  trxAmount: number;
}

const initialState = {
  loading: true,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(walletInfo.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(walletInfo.fulfilled, (state, action) => {
      setAll(state, action.payload);
      state.loading = false;
    })
    .addCase(walletInfo.rejected, (state, { error }) => {
      state.loading = false;
    });
  },
});

const baseInfo = (state: RootState) => state.nfts;

export default nftSlice.reducer;

export const { fetchAppSuccess } = nftSlice.actions;

export const getAppState = createSelector(baseInfo, (nfts) => nfts);
