import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";
import { winnerDataStyle } from "@types";

export const loadWinnerDetails = createAsyncThunk(
  "winner/loadWinnerDetails",
  async ({ winnerData }: IWinnerSlice) => {
    await instance
      .get("/api/winner")
      .then((response) => {
        winnerData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return {
      winnerData,
    };
  }
);

const initialState: {
  loading: boolean;
  winnerData: winnerDataStyle[];
} = {
  loading: true,
  winnerData: [],
};

export interface IWinnerSlice {
  winnerData: winnerDataStyle[];
}

const winnerSlice = createSlice({
  name: "winner",
  initialState,
  reducers: {
    updateWinnerData(state, action) {
      let updatedData: winnerDataStyle = action.payload;

      const index = state.winnerData.findIndex(
        (data) => data.address === updatedData.address
      );
      if (index < 0) {
        state.winnerData.push(updatedData);
      } else {
        state.winnerData[index] = updatedData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWinnerDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadWinnerDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadWinnerDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default winnerSlice.reducer;

export const { updateWinnerData } = winnerSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
