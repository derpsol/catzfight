// all abis...
import { abi as IntercroneswapV1Router02ABI } from "@intercroneswap/v2-periphery/build/IIswapV1Router02.json";

import ERC20_ABI from "../../constants/abis/erc20.json";

export const abis = [...ERC20_ABI, ...IntercroneswapV1Router02ABI];
