// src/lib/ipfs-vault/wallet.ts
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum"
};

let web3authInstance: Web3Auth | null = null;

export const initWeb3Auth = async (): Promise<Web3Auth> => {
  if (web3authInstance) {
    return web3authInstance;
  }

  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'demo-client-id';

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  
  web3authInstance = new Web3Auth({
    clientId,
    web3AuthNetwork: "sapphire_devnet",
    privateKeyProvider,
    uiConfig: {
      appName: "IPFS Secret Vault",
      theme: {
        primary: "#000000"
      },
      mode: "dark",
      loginMethodsOrder: ["google", "apple", "metamask", "walletconnect"]
    }
  });

  await web3authInstance.initModal();
  return web3authInstance;
};

export const getUserAddress = async (provider: SafeEventEmitterProvider): Promise<string> => {
  const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
  return accounts[0].toLowerCase();
};
