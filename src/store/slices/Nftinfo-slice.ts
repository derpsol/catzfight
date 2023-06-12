import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import tronWeb from "tronweb";
import instance from "constants/axios";

declare var window: any;

interface IloadNftDetails {
  account: any;
}

export const loadNftDetails = createAsyncThunk(
  "nft/loadNftDetails",
  async ({ account }: IloadNftDetails) => {
    let approvedList: any[] = [];
    await instance
      .get(`/api/approved`)
      .then((response) => {
        approvedList = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    let nftids: any[][] = [];
    let nfturl: string[] = [];
    let nfturis: any[][] = [];

    for (let j = 0; j < approvedList.length; j++) {
      nftids.push([]);
      nfturis.push([]);
      let nftContract;
      if (window) {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          nftContract = await window.tronWeb
            .contract()
            .at(tronWeb.address.toHex(approvedList[j].address));
        }
      }
      nfturl[j] = await nftContract.tokenURI(1).call();
      const nft_counts = await nftContract.balanceOf(account).call();
      for (let i = 0; i < Math.min(nft_counts, 6); i++) {
        let tmptokenID = await nftContract
          .tokenOfOwnerByIndex(account, i)
          .call();
        nftids[j][i] = tronWeb.toDecimal(tmptokenID);
      }
      for (let i = 0; i < Math.min(nft_counts, 6); i++) {
        nfturis[j][i] = `https://ipfs.io/ipfs/${nfturl[j].slice(7, 53)}/${
          nftids[j][i]
        }.png`;
      }
    }
    return {
      nftids,
      nfturis,
      nfturl,
      approvedList,
    };
  }
);

export interface INftDetailSlice {
  nftids: any[][];
  nfturis: any[][];
  nfturl: string[];
  approvedList: any[];
  // contractNFTs: number;
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
      .addCase(loadNftDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNftDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadNftDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.nfts;

export default nftSlice.reducer;

export const getAppState = createSelector(baseInfo, (nfts) => nfts);
