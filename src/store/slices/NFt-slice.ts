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

interface IapproveNFT {
  tokenId: Number;
}

export const approveNFT = createAsyncThunk(
  "NFT/loadMFTDetails",
  //@ts-ignore
  async ({ tokenId }: IapproveNFT, { dispatch }) => {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = "https://nile.trongrid.io";
    const solidityNode = "https://nile.trongrid.io";
    const eventServer = "https://nile.trongrid.io";
    const privateKey = "f40377da14d42e691ca51d43ea2a3177bfce04201a9ba2dd997e8e38c694722a";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    let nftContract = await tronWeb.contract().at('TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4')
    let enterTx;
    console.log("select nftContract");
    try {
      enterTx = await nftContract.approve(
        "TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M",
        tokenId
      ).send({ feeLimit: 100000000 }).then((output: any) => {console.log('- approve hash:', output, '\n');});
      console.log("sent request to contract");
      const text = "Approve";
      const pendingTxnType = "Approving";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
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
    const fullNode = "https://nile.trongrid.io";
    const solidityNode = "https://nile.trongrid.io";
    const eventServer = "https://nile.trongrid.io";
    const privateKey = "f40377da14d42e691ca51d43ea2a3177bfce04201a9ba2dd997e8e38c694722a";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    let nftContract = await tronWeb.contract().at('TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4')
    let allowtmp: String[] = [];
    await Promise.all(
      tokenIds.map(async (tokenId, index) => {
        let tmpstring = await nftContract.getApproved(tokenId);
        allowtmp[index] = tronWeb.toDecimal(tmpstring);
      })
    );
    console.log("allow array: ", allowtmp);
    let allows: boolean[] = [];
    allowtmp.map((allow, index) => {
      allows[index] = allow === "TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M";
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
