import { ChainId, Pair, Token } from "@intercroneswap/v2-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { useActiveWeb3React } from "../../hooks";
import { AppDispatch, AppState } from "../index";
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  toggleURLWarning,
} from "./actions";

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  };
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  );
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  );

  return userDarkMode === null ? matchesDarkMode : userDarkMode;
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useIsDarkMode();

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState["user"]["userExpertMode"]>(
    (state) => state.user.userExpertMode
  );
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
}

export function useUserSlippageTolerance(): [
  number,
  (slippage: number) => void
] {
  const dispatch = useDispatch<AppDispatch>();
  const userSlippageTolerance = useSelector<
    AppState,
    AppState["user"]["userSlippageTolerance"]
  >((state) => {
    return state.user.userSlippageTolerance;
  });

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }));
    },
    [dispatch]
  );

  return [userSlippageTolerance, setUserSlippageTolerance];
}
export function useUserDeadline(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>();
  const userDeadline = useSelector<AppState, AppState["user"]["userDeadline"]>(
    (state) => {
      return state.user.userDeadline;
    }
  );

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch]
  );

  return [userDeadline, setUserDeadline];
}
export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>();
  const userDeadline = useSelector<AppState, AppState["user"]["userDeadline"]>(
    (state) => {
      return state.user.userDeadline;
    }
  );

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch]
  );

  return [userDeadline, setUserDeadline];
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }));
    },
    [dispatch]
  );
}

export function useRemoveUserAddedToken(): (
  chainId: number,
  address: string
) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }));
    },
    [dispatch]
  );
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React();
  const serializedTokensMap = useSelector<AppState, AppState["user"]["tokens"]>(
    ({ user: { tokens } }) => tokens
  );

  return useMemo(() => {
    if (!chainId) return [];
    return Object.values(serializedTokensMap[chainId as ChainId] ?? {}).map(
      deserializeToken
    );
  }, [serializedTokensMap, chainId]);
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  };
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }));
    },
    [dispatch]
  );
}

export function useURLWarningVisible(): boolean {
  return useSelector((state: AppState) => state.user.URLWarningVisible);
}

export function useURLWarningToggle(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch]);
}

export function useAsyncV1LiquidityTokens(
  tokens: [Token, Token][]
): { liquidityToken: Token; tokens: [Token, Token] }[] {
  const [pairAddresses, setPairAddresses] = useState<string[]>([]);
  const { library } = useActiveWeb3React();
  useEffect(() => {
    if (library) {
      Promise.all(
        tokens.map(([tokenA, tokenB]: [Token, Token]) => {
          return Pair.getAddressAsync(tokenA, tokenB, library);
        })
      )
        .then((res: string[]) => {
          setPairAddresses(res);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [tokens, library]);
  return useMemo(() => {
    return pairAddresses.map((pairAddress, i) => {
      const pairTokens = tokens[i];
      return {
        liquidityToken: new Token(
          pairTokens[0].chainId,
          pairAddress,
          18,
          "ISwap",
          "ISwap"
        ),
        tokens: pairTokens,
      };
    });
  }, [pairAddresses, tokens]);
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV1LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(
    tokenA.chainId,
    Pair.getAddress(tokenA, tokenB),
    18,
    "ISwap",
    "ISwap"
  );
}
