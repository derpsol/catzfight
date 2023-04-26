import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import tronWeb from "tronweb";
import { SHASTA_TESTNET } from "../../constants/addresses";
import axios from "axios";

interface IStackingMeow {
  address: any;
  amount: string;
}

declare var window: any;

export const stackingMeow = createAsyncThunk(
  "stacking/stackingMeow",

  async ({ address, amount }: IStackingMeow, { dispatch }) => {
    let meowContract, meowTokenContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
          meowTokenContract = await window.tronWeb.contract().at(tronWeb.address.toHex(SHASTA_TESTNET.MEOWTOKEN_ADDRESS));
        }
    }
    let enterTx, approveTx;
    let stakeamount = parseInt(amount);
    try {
      console.log(stakeamount);
      approveTx = await meowTokenContract.approve(SHASTA_TESTNET.MEOW_ADDRESS, stakeamount).send({ feeLimit: 100000000 });
      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(approveTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }

      enterTx = await meowContract
        .stake(stakeamount)
        .send({ feeLimit: 100000000 });

      receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }
      await axios.post(`http://54.176.107.208/api/userinfo/create?address=${address}&stakeAmount=${stakeamount}&claimAmount=0&ownNfts=[]`);

      return;
    } catch (err: any) {
      console.log(err);
      return metamaskErrorWrap(err, dispatch);
    } finally {
      return;
    }
  }
);

interface IunstackingMeow {
  address: any;
  amount: string;
}

export const unstackingMeow = createAsyncThunk(
  "claimfight/claimfightMeow",

  async ({ amount, address }: IunstackingMeow, { dispatch }) => {
    let meowContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }
    let enterTx;
    let stakeamount = parseInt(amount);
    try {
      enterTx = await meowContract
        .unStake(stakeamount)
        .send({ feeLimit: 100000000 });

      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }
      await axios.post(`http://54.176.107.208/api/userinfo/create?address=${address}&stakeAmount=${stakeamount * (-1)}&claimAmount=0&ownNfts=[]`);

      return;
    } catch (err: any) {
      console.log(err);
      return metamaskErrorWrap(err, dispatch);
    } finally {
      return;
    }
  }
);

const initialState = {
  loading: true,
};

export interface IAppSlice {}

const stakeSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stackingMeow.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(stackingMeow.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(stackingMeow.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(unstackingMeow.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(unstackingMeow.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(unstackingMeow.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.stack;

export default stakeSlice.reducer;

export const { fetchAppSuccess } = stakeSlice.actions;

export const getAppState = createSelector(baseInfo, (stack) => stack);
