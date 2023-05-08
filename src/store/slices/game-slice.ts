import { setAll } from "helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import instance from "constants/axios";
import { gameDataStyle } from "@types";

export const loadGameDetails = createAsyncThunk(
  "game/loadGameDetails",
  async ({ gameData }: IAppSlice) => {
    let tmpgameData: gameDataStyle[] = [];
    await instance
      .get("/api/betting")
      .then((response) => {
        tmpgameData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < Math.max(4, tmpgameData.length + 2); i++) {
      let newGameData: gameDataStyle = {
        roomNum: 0,
        firstNFT: "",
        secondNFT: "",
        firstAddress: "",
        secondAddress: "",
        firstRandom: 0,
        secondRandom: 0,
        tokenId: 0,
        fightRoom: 0,
        flag: false
      };
      if (tmpgameData[i] !== undefined) {
        newGameData.firstNFT = tmpgameData[i]?.firstNFT;
        newGameData.firstAddress = tmpgameData[i]?.firstAddress;
        newGameData.firstRandom = tmpgameData[i]?.firstRandom;
        newGameData.fightRoom = tmpgameData[i]?.fightRoom;
        newGameData.tokenId = tmpgameData[i]?.tokenId;
        newGameData.secondNFT = tmpgameData[i]?.secondNFT;
        newGameData.secondAddress = tmpgameData[i]?.secondAddress;
        newGameData.secondRandom = tmpgameData[i]?.secondRandom;
        console.log("fightRoom", newGameData.fightRoom);
      }
      gameData.push(newGameData);
    }
    return {
      gameData,
    };
  }
);

const initialState: {
  loading: boolean;
  gameData: gameDataStyle[];
} = {
  loading: true,
  gameData: [],
};

export interface IAppSlice {
  gameData: gameDataStyle[];
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGameData(state, action) {
      let updatedData: gameDataStyle = {
        roomNum: 0,
        firstNFT: "",
        secondNFT: "",
        firstAddress: "",
        secondAddress: "",
        firstRandom: 0,
        secondRandom: 0,
        tokenId: 0,
        fightRoom: 0,
        flag: false
      };
      console.log('payload: ', action.payload);
      if(action.payload.delRoomNum > 0) {
        updatedData.roomNum = action.payload.delRoomNum;
      } else {
        updatedData = action.payload;
      }
      const index = state.gameData.findIndex(
        (data) => data.roomNum === updatedData.roomNum
      );
      if(index < 0) {
        state.gameData[updatedData.roomNum - 1] = updatedData;
      } else {
        state.gameData[index] = updatedData;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadGameDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadGameDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadGameDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gameSlice.reducer;

export const { updateGameData } = gameSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
