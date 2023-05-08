import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import TronWeb from "tronweb";
import { SHASTA_TESTNET } from "constants/addresses";

interface ILoadJackpotDetails {
  account: any;
}

declare var window: any;

export const loadJackpotDetails = createAsyncThunk(
  "jackpot/loadJackpotDetails",
  async ({ account }: ILoadJackpotDetails) => {
    let meowContract, meowTokenContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(TronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
        meowTokenContract = await window.tronWeb
          .contract()
          .at(TronWeb.address.toHex(SHASTA_TESTNET.MEOWTOKEN_ADDRESS));
      }
    }

    const gameprice = (await meowContract.gamePrice().call()).toString();
    const jackpotAmount = (
      (await meowContract.jackpotAmount().call()) / Math.pow(10, 6)
    ).toString();
    const meowCount = (
      await meowTokenContract.balanceOf(account).call()
    ).toString();
    return {
      gameprice,
      jackpotAmount,
      meowCount,
    };
  }
);

const initialState = {
  loading: true,
};

export interface IJackPotSlice {
  gameprice: string;
  jackpotAmount: string;
  loading: boolean;
  meowCount: string;
}

const jackpotSlice = createSlice({
  name: "jackpot",
  initialState,
  reducers: {
    fetchJackpotSuccess(state, action) {
      setAll(state, action.payload);
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadJackpotDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadJackpotDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadJackpotDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.jackpot;

export default jackpotSlice.reducer;

export const getAppState = createSelector(baseInfo, (jackpot) => jackpot);
