import tronWeb from "tronweb";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import axios from "axios";
import { setAll } from "../../helpers/set-all";
import { NILE_TESTNET } from "../../constants/addresses";

interface IenterRoomMeow {
  tokenId: Number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
  gamePrice: number;
  socket: any;
}
declare var window: any;

export const EnterRoom = createAsyncThunk(
  "enterRoom/enterRoomMeow",

  async (
    { tokenId, fightRoom, whichroom, url, address, gamePrice, socket }: IenterRoomMeow,
    { dispatch }
  ) => {
    let meowContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }
    axios.post(
      `http://192.168.106.175:8001/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}`
    );
    socket.emit("enter");

    let enterTx;
    try {
      enterTx = await meowContract
          .enterRoom(tokenId, fightRoom)
          .send({ feeLimit: 100000000, callValue: gamePrice })
          .then(() => { socket.emit('enter'); });
      return;
    } catch (err: any) {
      axios.delete(
        `http://192.168.106.175:8001/api/betting/delete/${whichroom}`
      );
      console.log(metamaskErrorWrap(err, dispatch));
      socket.emit("enter");
      return metamaskErrorWrap(err, dispatch);
    } finally {
      return;
    }
  }
);
interface IclaimFightMeow {
  tokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
  gamePrice: number;
  socket: any;
}

export const ClaimFight = createAsyncThunk(
  "claimfight/claimfightMeow",

  async (
    { tokenId, fightRoom, whichroom, url, address, gamePrice, socket }: IclaimFightMeow,
    { dispatch }
  ) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }

    let enterTx;
    let random1: number[] = [];
    let random2: number[] = [];
    axios.post(
      `http://192.168.106.175:8001/api/betting/update?roomnum=${whichroom}&secondNFT=${url}&secondaddress=${address}`
    );
    socket.emit("enter");
    try {
      console.log("start claim Fight");
      let room: any;
      enterTx = await meowContract
        .claimFight(tokenId, fightRoom)
        .send({ feeLimit: 200000000, callValue: gamePrice })
      room = await meowContract.room(fightRoom).call();
      console.log("roominfo: ", room);
      let firstrandom = Number(room.random1);
      let secondrandom = Number(room.random2);
      random1[whichroom] = firstrandom;
      random2[whichroom] = secondrandom;

      let winnerData: any;
      let flag: boolean = false;
      let resultData: any;
      await axios
        .get(
          `http://192.168.106.175:8001/api/betting/find?fightRoom=${fightRoom}`
        )
        .then((res) => {
          resultData = res.data;
        });

      if (firstrandom > secondrandom) {
        await axios
          .get(
            `http://192.168.106.175:8001/api/winner/find?address=${room.fighter1}`
          )
          .then((res) => {
            winnerData = res.data;
          });
      } else if (firstrandom < secondrandom) {
        await axios
          .get(
            `http://192.168.106.175:8001/api/winner/find?address=${room.fighter2}`
          )
          .then((res) => {
            winnerData = res.data;
          });
      } else {
        flag = true;
      }

      await axios.post(
        `http://192.168.106.175:8001/api/random/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&roomnum=${fightRoom}`
      );

      if (winnerData) {
        await axios.post(
          `http://192.168.106.175:8001/api/winner/update?address=${
            winnerData.address
          }&winCount=${winnerData.winCount + 1}`
        );
      } else {
        if (!flag) {
          if (firstrandom > secondrandom) {
            await axios.post(
              `http://192.168.106.175:8001/api/winner/create?address=${
                room.fighter1
              }&winCount=${1}`
            );
          } else if (firstrandom < secondrandom) {
            await axios.post(
              `http://192.168.106.175:8001/api/winner/create?address=${
                room.fighter2
              }&winCount=${1}`
            );
          }
        }
      }

      await axios.post(
        `http://192.168.106.175:8001/api/result/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&nftUrl1=${resultData.firstNFT}&nftUrl2=${resultData.secondNFT}&address1=${room.fighter1}&address2=${room.fighter2}&roomnum=${fightRoom}`
      );
      socket.emit("enter");

      return {
        random1,
        random2,
      };
    } catch (err: any) {
      axios.delete(
        `http://192.168.106.175:8001/api/betting/delete1/${whichroom}`
      );
      socket.emit("enter");
      console.log(metamaskErrorWrap(err, dispatch));
      return metamaskErrorWrap(err, dispatch);
    } finally {
      return;
    }
  }
);

const initialState = {
  loading: true,
};

export interface IWinSlice {
  random1: number[];
  random2: number[];
}

const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(EnterRoom.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EnterRoom.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(EnterRoom.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(ClaimFight.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ClaimFight.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(ClaimFight.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.fight;

export default fightSlice.reducer;

export const { fetchAppSuccess } = fightSlice.actions;

export const getAppState = createSelector(baseInfo, (fight) => fight);
