import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { SHASTA_TESTNET } from "constants/addresses";
import tronWeb from "tronweb";
import { notification } from "utils/notification";
import instance from "constants/axios";

interface IapproveNFT {
  tokenId: Number;
  address: string;
}

declare var window: any;

export const approveNFT = createAsyncThunk(
  "NFT/approveMFT",
  //@ts-ignore
  async ({ tokenId, address }: IapproveNFT, { dispatch }) => {
    let nftContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(address));
      }
    }
    try {
      let enterTx = await nftContract
        .approve(SHASTA_TESTNET.MEOW_ADDRESS, tokenId)
        .send({ feeLimit: 100000000 });

      let receipt = null;
      while (receipt === "REVERT" || receipt == null) {
        if (window.tronWeb) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          if (transaction && transaction.ret && transaction.ret.length > 0) {
            receipt = transaction.ret[0].contractRet;
          }
          console.log("receipt: ", receipt, enterTx);
        }
        if (receipt === "REVERT") {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }

      notification({ title: "Successfully approved!", type: "success" });
      return;
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
      return metamaskErrorWrap(err, dispatch);
    } finally {
    }
  }
);

interface IloadNftAllowance {
  tokenIds: Number[];
  index: number;
}

export const loadNftAllowance = createAsyncThunk(
  "app/loadNftAllowance",
  //@ts-ignore
  async ({ tokenIds, index }: IloadNftAllowance) => {
    let approvedList: any[] = [];
    await instance
      .get(`/api/approved`)
      .then((response) => {
        approvedList = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    let allows: boolean[][] = [];
    for (let i = 0; i < approvedList.length; i++) {
      allows.push([]);
    }
    let nftContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(approvedList[index].address));
      }
    }
    let allowtmp: String[] = [];
    await Promise.all(
      tokenIds.map(async (tokenId, idn) => {
        allowtmp[idn] = await nftContract.getApproved(tokenId).call();
      })
    );
    allowtmp.map((allow, idn) => {
      allows[index][idn] =
        allow === tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS);
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
  allowances: boolean[][];
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
      .addCase(loadNftAllowance.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNftAllowance.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadNftAllowance.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.nft;

export default nftSlice.reducer;

export const getAppState = createSelector(baseInfo, (nft) => nft);
