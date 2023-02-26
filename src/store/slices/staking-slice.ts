import { ethers } from "ethers";
import { getAddresses, Networks } from "../../constants";
import { meowContractABI } from "../../abi";
import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from "@ethersproject/providers";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { messages } from "../../constants/messages";
import { warning, success, info } from "./messages-slice";

interface IStackingMeow {
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  amount: string;
}

export const stackingMeow = createAsyncThunk(
  "stacking/stackingMeow",

  async ({ networkID, provider, amount }: IStackingMeow, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    await provider1.send("eth_requestAccounts", []);
    const signer = provider1.getSigner();
    const meowContract = new ethers.Contract(
      addresses.MEOW_ADDRESS,
      meowContractABI,
      signer
    );
    let enterTx;
    let stackamount = parseInt(amount);
    try {
      enterTx = await meowContract.stake(stackamount);
      const text = "EnterRoom";
      const pendingTxnType = "Entering";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
      return;
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);

interface IunstackingMeow {
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  amount: string;
}

export const unstackingMeow = createAsyncThunk(
  "claimfight/claimfightMeow",

  async ({ networkID, provider, amount }: IunstackingMeow, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    await provider1.send("eth_requestAccounts", []); // <- this promps user to connect metamask
    const signer = provider1.getSigner();
    const meowContract = new ethers.Contract(
      addresses.MEOW_ADDRESS,
      meowContractABI,
      signer
    );

    let enterTx;
    let unstackamount = parseInt(amount);
    try {
      enterTx = await meowContract.unStake(unstackamount);

      const text = "EnterRoom";
      const pendingTxnType = "Entering";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
      return;
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
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
      setAll(state, action.payload);
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
