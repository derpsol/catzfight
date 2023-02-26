import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { NFTContractABI } from "../../abi";
import { setAll } from "../../helpers/set-all";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../../state";
import { messages } from "../../constants/messages";
import { warning, success, info } from "./messages-slice";
import { fetchPendingTxns, clearPendingTxn } from "./pending-txns-slice";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";

interface IapproveNFT {
  networkID: number;
  provider: JsonRpcProvider;
  tokenId: Number;
}

export const approveNFT = createAsyncThunk(
  "NFT/loadMFTDetails",
  //@ts-ignore
  async ({ networkID, provider, tokenId }: IapproveNFT, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    await provider1.send("eth_requestAccounts", []); // <- this promps user to connect metamask
    const signer = provider1.getSigner();
    const nftContract = new ethers.Contract(
      addresses.NFT_ADDRESS,
      NFTContractABI,
      signer
    );
    let enterTx;
    try {
      enterTx = await nftContract.approve(
        "0x9e0E637be31FaBCB390393DE1c744fb29f8F322e",
        tokenId
      );
      const text = "Approve";
      const pendingTxnType = "Approving";

      dispatch(
        fetchPendingTxns({ txnHash: enterTx.hash, text, type: pendingTxnType })
      );
      await enterTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      dispatch(info({ text: messages.your_balance_update_soon }));
      dispatch(info({ text: messages.your_balance_updated }));
      return;
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

interface ILoadNFTDetails {
  networkID: number;
  provider: JsonRpcProvider;
  tokenIds: Number[];
}

export const loadNFTDetails = createAsyncThunk(
  "app/loadNFTDetails",
  //@ts-ignore
  async ({ networkID, provider, tokenIds }: ILoadNFTDetails) => {
    const addresses = getAddresses(networkID);
    const nftContract = new ethers.Contract(
      addresses.NFT_ADDRESS,
      NFTContractABI,
      provider
    );
    let allowtmp: String[] = [];
    await Promise.all(
      tokenIds.map(async (tokenId, index) => {
        allowtmp[index] = await nftContract.getApproved(tokenId);
      })
    );
    let allows: boolean[] = [];
    allowtmp.map((allow, index) => {
      allows[index] = allow === "0x9e0E637be31FaBCB390393DE1c744fb29f8F322e";
    });
    return {
      allowances: allows,
    };
  }
);

const initialState = {
  loading: true,
};

export interface INFTSlice {
  allowances: boolean[];
  loading: boolean;
}

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNFTDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNFTDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadNFTDetails.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.nft;

export default nftSlice.reducer;

export const { fetchAppSuccess } = nftSlice.actions;

export const getAppState = createSelector(baseInfo, (nft) => nft);
