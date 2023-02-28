import TronWeb from 'tronweb';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { messages } from "../../constants/messages";
import { success, info } from "./messages-slice";
import axios from "axios";
import { setAll } from "../../helpers/set-all";
import io from 'socket.io-client';
var socket = io('http://173.249.54.208');

interface IenterRoomMeow {
  tokenId: Number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
}

export const EnterRoom = createAsyncThunk(
  "enterRoom/enterRoomMeow",

  async (
    {
      tokenId,
      fightRoom,
      whichroom,
      url,
      address,
    }: IenterRoomMeow,
    { dispatch }
  ) => {
    const fullNode = "https://nile.trongrid.io";
    const solidityNode = "https://nile.trongrid.io";
    const eventServer = "https://nile.trongrid.io";
    const privateKey = "f40377da14d42e691ca51d43ea2a3177bfce04201a9ba2dd997e8e38c694722a";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    let meowContract = await tronWeb.contract().at('TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M');

    axios.post(
      `http://173.249.54.208/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}`
    );
    socket.emit('enter');

    let enterTx;
    try {
      enterTx = await meowContract.enterRoom(tokenId, fightRoom).send({ feeLimit: 100000000, value: 500000000 });
      const text = "EnterRoom";
      const pendingTxnType = "Entering";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
      
      return;
    } catch (err: any) {
      axios.delete(
        `http://173.249.54.208/api/betting/delete/${whichroom}`
      );
      socket.emit('enter');
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);
interface IclaimFightMeow {
  tokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
}

export const ClaimFight = createAsyncThunk(
  "claimfight/claimfightMeow",

  async (
    {
      tokenId,
      fightRoom,
      whichroom,
      url,
      address,
    }: IclaimFightMeow,
    { dispatch }
  ) => {
    const fullNode = "https://nile.trongrid.io";
    const solidityNode = "https://nile.trongrid.io";
    const eventServer = "https://nile.trongrid.io";
    const privateKey = "f40377da14d42e691ca51d43ea2a3177bfce04201a9ba2dd997e8e38c694722a";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    let meowContract = await tronWeb.contract().at('TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M');

    let enterTx;
    let random1: number[] = [];
    let random2: number[] = [];
    axios.post(
      `http://173.249.54.208/api/betting/update?roomnum=${whichroom}&secondNFT=${url}&secondaddress=${address}`
    );
    socket.emit('enter');
    try {
      enterTx = await meowContract.claimFight(tokenId, fightRoom).send({ feeLimit: 100000000, value: 500000000 });
      const text = "ClaimFight";
      const pendingTxnType = "Fighting";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
      
      let room = await meowContract.room(fightRoom);
      let firstrandom = Number(room.random1);
      let secondrandom = Number(room.random2);
      random1[whichroom] = firstrandom;
      random2[whichroom] = secondrandom;

      let winnerData: any;
      let flag: boolean = false;
      let resultData: any;
      await axios
      .get(`http://173.249.54.208/api/betting/find?fightRoom=${fightRoom}`)
      .then((res) => {
        resultData = res.data;
      });

      if (firstrandom > secondrandom) {
        await axios
          .get(
            `http://173.249.54.208/api/winner/find?address=${room.fighter1}`
          )
          .then((res) => {
            winnerData = res.data;
          });
      } else if (firstrandom < secondrandom) {
        await axios
          .get(
            `http://173.249.54.208/api/winner/find?address=${room.fighter2}`
          )
          .then((res) => {
            winnerData = res.data;
          });
      } else {
        flag = true;
      }

      await axios.post(
        `http://173.249.54.208/api/random/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&roomnum=${fightRoom}`
      );

      if (winnerData) {
        await axios.post(
          `http://173.249.54.208/api/winner/update?address=${winnerData.address}&winCount=${winnerData.winCount + 1}`
        );
      } else {
        if (!flag) {
          if (firstrandom > secondrandom) {
            await axios.post(
            `http://173.249.54.208/api/winner/create?address=${room.fighter1}&winCount=${1}`
          );
        } else if (firstrandom < secondrandom) {
          await axios.post(
              `http://173.249.54.208/api/winner/create?address=${room.fighter2}&winCount=${1}`
            );
          }
        }
      }

      await axios.post(
        `http://173.249.54.208/api/result/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&nftUrl1=${resultData.firstNFT}&nftUrl2=${resultData.secondNFT}&address1=${room.fighter1}&address2=${room.fighter2}&roomnum=${fightRoom}`
      );
  
      return {
        random1,
        random2,
      };
    } catch (err: any) {
      axios.delete(
        `http://173.249.54.208/api/betting/delete1/${whichroom}`
      );
      socket.emit('enter');
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
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
