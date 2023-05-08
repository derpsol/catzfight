import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";

interface IwalletInfo {
  account: any;
}

export const walletInfo = createAsyncThunk(
  "nft/walletInfo",
  async ({ account }: IwalletInfo) => {
    let tmpData: any;
    let usersData: any;
    await instance
      .get(`/api/userinfo`)
      .then((response) => {
        usersData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    let totalStake = 0;
    for (let i = 0; i < usersData.length; i++) {
      totalStake += usersData[i].stakeAmount;
    }

    await instance
      .get(`/api/userinfo/find?address=${account}`)
      .then((response) => {
        tmpData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    let nftCount = tmpData?.ownNfts.length;
    let nftInfo: number[] = tmpData?.ownNfts;
    let trxAmount = tmpData?.claimAmount / 1000000;
    let stakeAmount = tmpData?.stakeAmount;
    return {
      nftCount,
      trxAmount,
      stakeAmount,
      totalStake,
      nftInfo,
    };
  }
);

export interface IWalletInfoDetail {
  nftCount: number;
  trxAmount: number;
  stakeAmount: number;
  totalStake: number;
  nftInfo: number[];
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

export const getAppState = createSelector(baseInfo, (nfts) => nfts);
