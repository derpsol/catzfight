import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";
import { randomDataStyle } from "@types";

export const loadRandomDetails = createAsyncThunk(
  "random/loadRandomDetails",
  async ({ randomData }: IRandomSlice) => {
    await instance
      .get("/api/random")
      .then((response) => {
        randomData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      randomData,
    };
  }
);

const initialState: {
  loading: boolean;
  randomData: randomDataStyle[];
} = {
  loading: true,
  randomData: [],
};

export interface IRandomSlice {
  randomData: randomDataStyle[];
}

const randomSlice = createSlice({
  name: "random",
  initialState,
  reducers: {
    updateRandomData(state, action) {
      let updatedData: randomDataStyle = action.payload;

      state.randomData.unshift(updatedData);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRandomDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadRandomDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadRandomDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.random;

export default randomSlice.reducer;

export const { updateRandomData } = randomSlice.actions;

export const getAppState = createSelector(baseInfo, (random) => random);
