import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@intercroneswap/v2-sdk";
import { ethAddress, remove0xPrefix } from "@intercroneswap/java-tron-provider";
import { getAddress } from "ethers/lib/utils";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  11111: "",
  1: "shasta.",
  201910292: "nile.",
};

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: "transaction" | "token" | "address" | "block"
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[11111]
  }tronscan.org`;

  switch (type) {
    case "transaction": {
      return `${prefix}/#/transaction/${remove0xPrefix(data)}`;
    }
    case "token": {
      return `${prefix}/#/token20/${ethAddress.toTron(data)}`;
    }
    case "address":
    default: {
      return `${prefix}/#/address/${ethAddress.toTron(data)}`;
    }
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const tronAddress = ethAddress.toTron(parsed);
  return `${tronAddress.substring(0, chars)}...${tronAddress.substr(-chars)}`;
}

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): any {
  // return account ? library?.trx.sign : library?.trx
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
