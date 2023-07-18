import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";

interface IBattleDetails {
  claimState: boolean;
  decide: boolean;
  openState: boolean;
  waitingRandom: number;
  whichfight: number;
  whichroom: number;
  waitingNft: string;
}

export const loadBattleDetails = createAsyncThunk(
  "app/loadBattleDetails",
  async ({
    openState,
    claimState,
    whichfight,
    whichroom,
    waitingRandom,
    decide,
    waitingNft,
  }: IBattleDetails) => {
    return {
      openState,
      claimState,
      whichfight,
      whichroom,
      waitingRandom,
      decide,
      waitingNft,
    };
  }
);

const initialState = {
  loading: true,
  openState: false,
  claimState: false,
  whichroom: 0,
  whichfight: 0,
  waitingRandom: 0,
  decide: false,
  waitingNft: "",
};

export interface IBattleSlice {
  loading: boolean;
  openState: boolean;
  claimState: boolean;
  whichroom: number;
  whichfight: number;
  waitingRandom: number;
  waitingNft: string;
  decide: boolean;
}

const battleSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBattleDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadBattleDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadBattleDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.battle;

export default battleSlice.reducer;

export const getAppState = createSelector(baseInfo, (battle) => battle);
