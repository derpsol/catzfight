import { ethers } from "ethers";
import { getAddresses, Networks } from "../../constants";
import { meowContractABI } from "../../abi";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from "@ethersproject/providers";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { messages } from "../../constants/messages";
import { warning, success, info } from "./messages-slice";
import axios from "axios";
import { setAll } from "../../helpers/set-all";
import { NILE_TESTNET } from "../../constants/addresses";
import tronWeb from "tronweb";

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
    let enterTx;
    try {
      console.log("before enter room");
      enterTx = await meowContract
      .enterRoom(tokenId)
      .send({ feeLimit: 100000000, callValue: gamePrice })
      console.log("before getting event: ", enterTx);
      await enterTx.wait();
      console.log("enterTx: ", enterTx);

      axios.post(
        `http://localhost:8001/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}`
      );
      return;
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);

interface IWidrawNFT {
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const widrawNFT = createAsyncThunk(
  "widrawNFT/widrawNFT",

  async ({ networkID, provider }: IWidrawNFT, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    await provider1.send("eth_requestAccounts", []); // <- this promps user to connect metamask
    const signer = provider1.getSigner();
    const meowContract = new ethers.Contract(
      addresses.MEOW_ADDRESS,
      meowContractABI,
      signer
    );
    let enterTx;
    try {
      enterTx = await meowContract.claimNFT();

      await enterTx.wait();
    } catch (err: any) {
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

    let enterTx;
    let random1: number[] = [];
    let random2: number[] = [];
    try {
      enterTx = await meowContract.claimFight(tokenId, fightRoom, {
        value: 50000000,
      });

      // await enterTx.wait();

      // axios.post(
      //   `http://localhost:8001/api/betting/update?roomnum=${whichroom}&secondNFT=${url}&secondaddress=${address}`
      // );
      // let room = await meowContractRead.room(fightRoom);
      // let firstrandom = Number(room.random1);
      // let secondrandom = Number(room.random2);
      // random1[whichroom] = firstrandom;
      // random2[whichroom] = secondrandom;

      // let winnerData: any;
      // let flag: boolean = false;
      // let resultData: any;
      // await axios
      //   .get(
      //     `http://localhost:8001/api/betting/find?fightRoom=${fightRoom}`
      //   )
      //   .then((res) => {
      //     resultData = res.data;
      //   });

      // if (firstrandom > secondrandom) {
      //   await axios
      //     .get(
      //       `http://localhost:8001/api/winner/find?address=${room.fighter1}`
      //     )
      //     .then((res) => {
      //       winnerData = res.data;
      //     });
      // } else if (firstrandom < secondrandom) {
      //   await axios
      //     .get(
      //       `http://localhost:8001/api/winner/find?address=${room.fighter2}`
      //     )
      //     .then((res) => {
      //       winnerData = res.data;
      //     });
      // } else {
      //   flag = true;
      // }

      // await axios.post(
      //   `http://localhost:8001/api/random/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&roomnum=${fightRoom}`
      // );

      // if (winnerData) {
      //   await axios.post(
      //     `http://localhost:8001/api/winner/update?address=${
      //       winnerData.address
      //     }&winCount=${winnerData.winCount + 1}`
      //   );
      // } else {
      //   if (!flag) {
      //     if (firstrandom > secondrandom) {
      //       await axios.post(
      //         `http://localhost:8001/api/winner/create?address=${
      //           room.fighter1
      //         }&winCount=${1}`
      //       );
      //     } else if (firstrandom < secondrandom) {
      //       await axios.post(
      //         `http://localhost:8001/api/winner/create?address=${
      //           room.fighter2
      //         }&winCount=${1}`
      //       );
      //     }
      //   }
      // }

      // await axios.post(
      //   `http://localhost:8001/api/result/create?randomNumber1=${room.random1}&randomNumber2=${room.random2}&nftUrl1=${resultData.firstNFT}&nftUrl2=${resultData.secondNFT}&address1=${room.fighter1}&address2=${room.fighter2}&roomnum=${fightRoom}`
      // );

      return {
        // random1,
        // random2,
      };
    } catch (err: any) {
      console.log(metamaskErrorWrap(err, dispatch));
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
      .addCase(widrawNFT.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(widrawNFT.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(widrawNFT.rejected, (state, { error }) => {
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
