import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import tronWeb from 'tronweb';
import { NILE_TESTNET } from "../../constants/addresses";

interface IapproveNFT {
  tokenId: Number;
}
declare var window: any

export const approveNFT = createAsyncThunk(
  "NFT/loadMFTDetails",
  //@ts-ignore
  async ({ tokenId }: IapproveNFT, { dispatch }) => {
    let nftContract;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex(NILE_TESTNET.NFT_ADDRESS));
      }
    }
    let enterTx;
    try {
      enterTx = await nftContract.approve(
        NILE_TESTNET.MEOW_ADDRESS,
        tokenId
      ).send({ feeLimit: 100000000 });
      return;
    } catch (err: any) {
      console.log(metamaskErrorWrap(err, dispatch));
      console.log("there is an error while approving");
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);

interface ILoadNFTDetails {
  tokenIds: Number[];
}

export const loadNFTDetails = createAsyncThunk(
  "app/loadNFTDetails",
  //@ts-ignore
  async ({ tokenIds }: ILoadNFTDetails) => {
    let nftContract: any;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex(NILE_TESTNET.NFT_ADDRESS));
      }
    }
    let allowtmp: String[] = [];
    await Promise.all(
      tokenIds.map(async (tokenId, index) => {
        allowtmp[index] = await nftContract.getApproved(tokenId).call();
      })
    );
    let allows: boolean[] = [];
    allowtmp.map((allow, index) => {
      allows[index] = allow === tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS);
    });
    return {
      allowances: allows,
    };
  }
);

const initialState = {
  loading: true,
};

export interface INFTSlice {
  allowances: boolean[];
  loading: boolean;
}

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNFTDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNFTDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadNFTDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.nft;

export default nftSlice.reducer;

export const { fetchAppSuccess } = nftSlice.actions;

export const getAppState = createSelector(baseInfo, (nft) => nft);
