import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";

interface IBattleDetails {
  openState: boolean,
  claimState: boolean,
  whichroom: number,
  whichfight: number,
  waitingRandom: number,
  decide: boolean,
}

export const loadBattleDetails = createAsyncThunk(
  "app/loadBattleDetails",
  async ({ openState, claimState, whichfight, whichroom, waitingRandom, decide }: IBattleDetails ) => {
    return {
      openState,
      claimState,
      whichfight,
      whichroom,
      waitingRandom,
      decide,
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
};

export interface IBattleSlice {
  loading: boolean,
  openState: boolean,
  claimState: boolean,
  whichroom: number,
  whichfight: number,
  waitingRandom: number,
  decide: boolean,
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
