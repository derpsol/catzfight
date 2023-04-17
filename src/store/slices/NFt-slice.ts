import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { SHASTA_TESTNET } from '../../constants/addresses';
import tronWeb from 'tronweb';
import { notification } from "utils/notification";

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
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex(SHASTA_TESTNET.NFT_ADDRESS));
      }
    }
    try {
      await nftContract.approve(
        SHASTA_TESTNET.MEOW_ADDRESS,
        tokenId
      ).send({ feeLimit: 100000000 });

      notification({ title: "Successfully approved!", type: "success"});
      return;
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger"});
      return metamaskErrorWrap(err, dispatch);
    } finally {
    }
  }
);

interface IloadNftAllowance {
  tokenIds: Number[];
}

export const loadNftAllowance = createAsyncThunk(
  "app/loadNftAllowance",
  //@ts-ignore
  async ({ tokenIds }: IloadNftAllowance) => {
    let nftContract: any;
    if(window) {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb.contract().at(tronWeb.address.toHex(SHASTA_TESTNET.NFT_ADDRESS));
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
      allows[index] = allow === tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS);
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

export const { fetchAppSuccess } = nftSlice.actions;

export const getAppState = createSelector(baseInfo, (nft) => nft);
