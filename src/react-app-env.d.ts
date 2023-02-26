/// <reference types="react-scripts" />

declare module "jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement;
}

declare module "fortmatic";

interface tronWeb {
  send: unknown;
  enable: () => Promise<string[]>;
  on?: (method: string, listener: (...args: any[]) => void) => void;
  removeListener?: (method: string, listener: (...args: any[]) => void) => void;
  trx?: { getBlock?: (m: string) => Promise };
  defaultAddress?: {
    base58?: "";
  };
  fullNode?: {
    chainType?: "";
    host?: "https://fullnode.intercroneswap.com";
  };
}
interface Window {
  tronWeb?: tronWeb;
}
declare const __DEV__: boolean;
declare module "tronweb";
declare module "@intercroneswap/java-tron-provider";
declare module "trongrid";
declare module "content-hash" {
  declare function decode(x: string): string;
  declare function getCodec(x: string): string;
}

declare module "multihashes" {
  declare function decode(buff: Uint8Array): {
    code: number;
    name: string;
    length: number;
    digest: Uint8Array;
  };
  declare function toB58String(hash: Uint8Array): string;
}
