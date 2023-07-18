import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "constants/axios";
import { notification } from "utils/notification";
import tronWeb from "tronweb";

declare var window : any;

interface IAddNft {
  address: string;
}

export const AddNft = createAsyncThunk(
  "nftadd/AddNft",
  async ({ address }: IAddNft) => {
    let nftContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        nftContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(address));
      }
    }
    let nftName = await nftContract.name().call();
    let nftSymbol = await nftContract.symbol().call();

    await instance.post(`/api/waiting/create`, {
      address: address,
      name: nftName,
      symbol: nftSymbol,
    });

    notification({ title: "Successfully Sent!", type: "success" });
  }
);

interface IApproveNft {
  address: string;
  name: string;
  symbol: string;
}

export const ApproveNft = createAsyncThunk(
  "nftapprove/ApproveNft",
  async ({ address, name, symbol }: IApproveNft) => {
    await instance.post(`/api/approved/create`, {
      address: address,
      name: name,
      symbol: symbol,
    });
    await instance.delete(`/api/waiting/delete/${address}`);

    notification({ title: "Successfully Approved!", type: "success" });
  }
);

interface IDeleteWaiting {
  address: string;
}

export const DeleteWaiting = createAsyncThunk(
  "deletewaiting/DeleteWaiting",
  async ({ address }: IDeleteWaiting) => {
    await instance.delete(`/api/waiting/delete/${address}`);

    notification({ title: "Successfully Deleted!", type: "success" });
  }
);

interface IDeleteApproved {
  address: string;
}

export const DeleteApproved = createAsyncThunk(
  "DeleteApproved/DeleteApproved",
  async ({ address }: IDeleteApproved) => {
    await instance.delete(`/api/approved/delete/${address}`);

    notification({ title: "Successfully Deleted!", type: "success" });
  }
);
