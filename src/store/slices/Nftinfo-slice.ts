import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { SHASTA_TESTNET } from '../../constants/addresses';
import tronWeb from 'tronweb';

declare var window: any

interface IloadNftDetails {
  account: any;
}

export const loadNftDetails = createAsyncThunk(
  'nft/loadNftDetails',
  async ({ account }: IloadNftDetails) => {
    let meowContract, nftContract;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb.contract().at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex(SHASTA_TESTNET.NFT_ADDRESS));
      }
    }
    let nftids: any[] = [];
    let nfturls: any[] = [];
    let nfturis: any[] = [];
    const contractNFTCount = await meowContract.tokenOwnerLength(account).call();
    const nft_counts = await nftContract.balanceOf(account).call();
    for (let i = 0; i < Math.min(nft_counts, 6); i++) {
      let tmptokenID = await nftContract.tokenOfOwnerByIndex(account, i).call();
      nftids[i] = tronWeb.toDecimal(tmptokenID);
    }

    for (let i = 0; i < Math.min(nft_counts, 6); i++) {
      nfturls[i] = await nftContract.tokenURI(nftids[i]).call();
    }

    for (let i = 0; i < Math.min(nft_counts, 6); i++) {
      nfturis[i] = `https://ipfs.io/ipfs/${nfturls[i].slice(7, 53)}/${
        nftids[i]
      }.png`;
    }
    let contractNFTs = 0;
    // for (let i = contractNFTCount - 1; i >= 0; i--) {
    //   let tmp = await meowContract.tokenOwner(account, i).call();
    //   if (tmp === 0) break;
    //   contractNFTs++;
    // }
    return {
      nftids,
      nfturis,
      // contractNFTs,
    };
  }
)

export interface INftDetailSlice {
  nftids: any[];
  nfturis: any[];
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

export const { fetchAppSuccess } = nftSlice.actions;

export const getAppState = createSelector(baseInfo, (nfts) => nfts);
