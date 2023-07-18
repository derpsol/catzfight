import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";

export const loadWaitingDetails = createAsyncThunk(
  "waiting/loadWaitingDetails",
  async ({ waitingList, approvedList }: IWaitingSlice) => {
    await instance
      .get(`/api/waiting`)
      .then((response) => {
        waitingList = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    await instance
      .get(`/api/approved`)
      .then((response) => {
        approvedList = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      waitingList,
      approvedList,
    };
  }
);

const initialState = {
  loading: true,
  waitingList: [],
  approvedList: [],
};

export interface IWaitingSlice {
  approvedList: any[];
  waitingList: any[];
}

const waitingSlice = createSlice({
  name: "waiting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWaitingDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadWaitingDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadWaitingDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.waiting;

export default waitingSlice.reducer;

export const getAppState = createSelector(baseInfo, (waiting) => waiting);
