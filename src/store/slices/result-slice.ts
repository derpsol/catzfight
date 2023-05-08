import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";
import { resultDataStyle } from "@types";

export const loadResultDetails = createAsyncThunk(
  "result/loadResultDetails",
  async ({ resultData }: IResultSlice) => {
    await instance
      .get("/api/result")
      .then((response) => {
        resultData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      resultData,
    };
  }
);

const initialState: {
  loading: boolean,
  resultData: resultDataStyle[],
} = {
  loading: true,
  resultData: [],
};

export interface IResultSlice {
  resultData: resultDataStyle[];
}

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    updateResultData(state, action) {
      let updatedData: resultDataStyle = action.payload;

      state.resultData.unshift(updatedData);
      state.resultData.pop();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadResultDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadResultDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadResultDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.result;

export default resultSlice.reducer;

export const { updateResultData } = resultSlice.actions;

export const getAppState = createSelector(baseInfo, (result) => result);
