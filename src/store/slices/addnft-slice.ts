import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";
import { notification } from "utils/notification";

interface IAddNft {
  address: string;
}

export const AddNft = createAsyncThunk(
  "nftadd/AddNft",
  async ({ address }: IAddNft) => {
    await instance.post(`/api/waiting/create`, {
      address: address,
    });

    notification({ title: "Successfully Sent!", type: "success" });
  }
);

const initialState = {
  loading: true,
};

const addNftSlice = createSlice({
  name: "addnft",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddNft.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddNft.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(AddNft.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.nfts;

export default addNftSlice.reducer;

export const getAppState = createSelector(baseInfo, (nfts) => nfts);
