import createTronLinkProvider from '@intercroneswap/tronlink-provider';
import Web3 from 'web3';
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { abis } from './tronlink-abis';

export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

export class InjectedTronConnector extends AbstractConnector {
  public provider: any;

  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs);

    const getFunctionSelector = (abi: any) => {
      return abi.name + '(' + getParamTypes(abi.inputs || []).join(',') + ')';
    };
    const getParamTypes = (params: any) => {
      return params.map(({ type, components }: { type: any; components: any }) => {
        if (type === 'tuple[]') {
          return (
            '(' +
            components
              .map(({ type }: { type: any }) => {
                return type;
              })
              .join(',') +
            ')[]'
          );
        }
        return type;
      });
    };
    const signs: any = {};
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider('wss://nile.infura.io/ws/v3/7f14d2eb070c41029d687df66b286a09'),
    );
    abis.map((fn: any) => {
      try {
        const sign = web3.eth.abi.encodeFunctionSignature({
          name: fn.name,
          type: fn.type,
          inputs: fn.inputs,
        });
        signs[sign] = getFunctionSelector(fn);
      } catch (err) {
      }
    });
    // TODO(tron): should auto-use same network as one selected in tronlink!
    this.provider = createTronLinkProvider({
      network: process.env.REACT_APP_TRON_NETWORK,
      tronApiUrl: process.env.REACT_APP_NETWORK_URL,
      functionSignatures: abis,
      signs,
    });
    /*
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
    */
  }

  async requestProvider(args: any) {
    const res = await this.provider.request(args);
    return res;
  }

  public async activate(): Promise<ConnectorUpdate> {
    const accounts = await this.requestProvider({ method: 'eth_accounts' });
    const account = accounts[0];
    return { provider: this.provider, account };
  }

  public async getProvider(): Promise<any> {
    return this.provider;
  }

  public async getChainId(): Promise<number | string> {
    const chainId = await this.requestProvider({ method: 'eth_chainId' });
    return chainId;
  }

  public async getAccount(): Promise<null | string> {
    const accounts = await this.requestProvider({ method: 'eth_accounts' });
    const account = accounts[0];
    return account;
  }

  public deactivate() {
    return true;
  }

  public async isAuthorized(): Promise<boolean> {
    // TODO: check if tronlink unlocked?
    return true;
  }
}
