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
    let maxRoomNum = 0;
    for (let i = 0; i < tmpgameData.length; i++) {
      maxRoomNum = Math.max(tmpgameData[i].roomNum, maxRoomNum);
    }
    for (let i = 0; i < Math.max(4, maxRoomNum + 2); i++) {
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
      gameData.push(newGameData);
    }
    let tmpcnt = 0;
    for (let i = 0; i < Math.max(4, maxRoomNum + 2); i++) {
      if(i + 1 === tmpgameData[tmpcnt]?.roomNum) {
        gameData[i].roomNum = tmpgameData[tmpcnt].roomNum;
        gameData[i].firstNFT = tmpgameData[tmpcnt]?.firstNFT;
        gameData[i].firstAddress = tmpgameData[tmpcnt]?.firstAddress;
        gameData[i].firstRandom = tmpgameData[tmpcnt]?.firstRandom;
        gameData[i].fightRoom = tmpgameData[tmpcnt]?.fightRoom;
        gameData[i].tokenId = tmpgameData[tmpcnt]?.tokenId;
        gameData[i].secondNFT = tmpgameData[tmpcnt]?.secondNFT;
        gameData[i].secondAddress = tmpgameData[tmpcnt]?.secondAddress;
        gameData[i].secondRandom = tmpgameData[tmpcnt]?.secondRandom;
        tmpcnt ++;
      }
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

      let maxRoomNum = 0;
      let emptyData: gameDataStyle = {
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
      for(let i = 0; i < state.gameData.length; i ++) {
        maxRoomNum = Math.max(state.gameData[i].roomNum, maxRoomNum);
      }
      for(let i = 0; i < Math.max(4, maxRoomNum + 2); i ++) {
        if(state.gameData[i] === undefined) {
          state.gameData[i] = emptyData;
        }
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
