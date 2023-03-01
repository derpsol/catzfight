import { setAll } from "../../helpers/set-all";
import TronWeb from 'tronweb';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { messages } from "../../constants/messages";
import { success, info } from "./messages-slice";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import tronWeb from 'tronweb';

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
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex('TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4'));
      }
    }
    let enterTx;
    try {
      enterTx = await nftContract.approve(
        "TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M",
        tokenId
      ).send({ feeLimit: 100000000 });
      const text = "Approve";
      const pendingTxnType = "Approving";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx, text, type: pendingTxnType })
      );
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
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
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex('TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4'));
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
      allows[index] = allow === tronWeb.address.toHex("TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M");
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
      // console.log(action.payload);
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
