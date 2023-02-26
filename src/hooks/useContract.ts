import { Contract } from "@ethersproject/contracts";
import { ChainId } from "@intercroneswap/v2-sdk";
import { useMemo } from "react";
import ENS_PUBLIC_RESOLVER_ABI from "../constants/abis/ens-public-resolver.json";
import ENS_ABI from "../constants/abis/ens-registrar.json";
import { MULTICALL_ABI, MULTICALL_NETWORKS } from "../constants/multicall";
import { getContract } from "../utils";
import { useActiveWeb3React } from "./index";

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      // TODO(tron): shasta TNS ?
      case ChainId.MAINNET:
        address = "0x99fb68F0672E3E16AbB071342eF03355dfcb1797";
        break;
      // TODO
      case ChainId.NILE:
        address = "0xD2577ec90C6Fb23EC208B27609867E30D69bDc89";
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}
