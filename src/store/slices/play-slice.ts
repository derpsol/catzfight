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
  tokenId: number;
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
    {
      tokenId,
      fightRoom,
      whichroom,
      url,
      address,
      gamePrice,
      socket,
    }: IenterRoomMeow,
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
    socket.emit("enter");
    
    await meowContract
      .enterRoom(tokenId)
      .send({ feeLimit: 100000000, callValue: gamePrice })
      .then(() => {
        socket.emit("enter");
      });
    let random_tmp;
    console.log("before getting event");
    await meowContract.goSmallRoom().watch((err: any, event: any) => {
      if (err) return console.error('Error with "Message" event:', err);

      console.log("- Result:", event.result.random, "\n");
      random_tmp = event.result.random;

      // writeEnterData(whichroom, url, address, fightRoom, random_tmp, tokenId);

      console.groupEnd();
    });
    await axios.post(
      `http://192.168.106.175:8001/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}&firstRandom=${random_tmp}&firstId=${tokenId}`
    );
    console.log("after getting event");
    return;
  }
);

async function writeEnterData(
  whichroom: number,
  url: string,
  address: string,
  fightRoom: number,
  random_tmp: number,
  tokenId: number,
) {
  await axios.post(
    `http://192.168.106.175:8001/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}&firstRandom=${random_tmp}&firstId=${tokenId}`
  );
  return;
}

interface IclaimFightMeow {
  tokenId: number;
  preTokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  waitingRandom: number;
  address: any;
  gamePrice: number;
  socket: any;
}

export const ClaimFight = createAsyncThunk(
  "claimfight/claimfightMeow",

  async (
    {
      tokenId,
      preTokenId,
      fightRoom,
      whichroom,
      url,
      waitingRandom,
      address,
      gamePrice,
      socket,
    }: IclaimFightMeow,
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

    let random_tmp: number;
    // let random1: number[] = [];
    // let random2: number[] = [];

    socket.emit("enter");

    console.log("start claim Fight");
    await meowContract
      .claimFight(tokenId)
      .send({ feeLimit: 200000000, callValue: gamePrice })
      .then((receipt: any) => {
        console.log("receipt: ", receipt);
      });
    await meowContract.fightSmallRoom().watch((err: any, event: any) => {
      if (err) return console.error('Error with "Message" event:', err);

      console.log("- Result:", event.result.random, "\n");
      random_tmp = event.result.random;
      console.groupEnd();
    });

    setTimeout(async () => {
      await axios.post(
        `http://192.168.106.175:8001/api/betting/update?roomnum=${whichroom}&secondNFT=${url}&secondaddress=${address}&secondRandom=${random_tmp}&secondId=${tokenId}`
      );
      console.log("post successful");
    }, 10000);

    // console.log("waiting and preve", waitingRandom, preTokenId);
    // console.log("current and token", random_tmp, tokenId);

    console.log("after setTimeout");
    // let firstrandom = waitingRandom;
    // let secondrandom = random_tmp;
    // random1[whichroom] = firstrandom;
    // random2[whichroom] = secondrandom;

    // let winnerData: any;
    // let flag: boolean = false;
    // let resultData: any;
    // await axios
    //   .get(
    //     `http://192.168.106.175:8001/api/betting/find?fightRoom=${fightRoom}`
    //   )
    //   .then((res) => {
    //     resultData = res.data;
    //   });

    // if (firstrandom > secondrandom) {
    //   await axios
    //     .get(
    //       `http://192.168.106.175:8001/api/winner/find?address=${room.fighter1}`
    //     )
    //     .then((res) => {
    //       winnerData = res.data;
    //     });
    // } else if (firstrandom < secondrandom) {
    //   await axios
    //     .get(
    //       `http://192.168.106.175:8001/api/winner/find?address=${room.fighter2}`
    //     )
    //     .then((res) => {
    //       winnerData = res.data;
    //     });
    // } else {
    //   flag = true;
    // }

    // await axios.post(
    //   `http://192.168.106.175:8001/api/random/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&roomnum=${fightRoom}`
    // );

    // if (winnerData) {
    //   await axios.post(
    //     `http://192.168.106.175:8001/api/winner/update?address=${
    //       winnerData.address
    //     }&winCount=${winnerData.winCount + 1}`
    //   );
    // } else {
    //   if (!flag) {
    //     if (firstrandom > secondrandom) {
    //       await axios.post(
    //         `http://192.168.106.175:8001/api/winner/create?address=${
    //           room.fighter1
    //         }&winCount=${1}`
    //       );
    //     } else if (firstrandom < secondrandom) {
    //       await axios.post(
    //         `http://192.168.106.175:8001/api/winner/create?address=${
    //           room.fighter2
    //         }&winCount=${1}`
    //       );
    //     }
    //   }
    // }

    // await axios.post(
    //   `http://192.168.106.175:8001/api/result/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&nftUrl1=${resultData.firstNFT}&nftUrl2=${resultData.secondNFT}&address1=${room.fighter1}&address2=${room.fighter2}&roomnum=${fightRoom}`
    // );
    socket.emit("enter");

    return {
      // random1,
      // random2,
    };
  }
);

const initialState = {
  loading: true,
};

export interface IWinSlice {
  // random1: number[];
  // random2: number[];
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
