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
  async ({ resultData, myResultData, address }: IResultSlice) => {
    await instance
      .get("/api/result")
      .then((response) => {
        resultData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    await instance
      .get(`/api/result/myresult?address=${address}`)
      .then((response) => {
        myResultData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      resultData,
      myResultData,
    };
  }
);

const initialState: {
  loading: boolean;
  resultData: resultDataStyle[];
  myResultData: resultDataStyle[];
  address: any;
} = {
  loading: true,
  resultData: [],
  myResultData: [],
  address: "",
};

export interface IResultSlice {
  resultData: resultDataStyle[];
  myResultData: resultDataStyle[];
  address: any;
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
