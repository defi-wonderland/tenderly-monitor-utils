import { Address } from './types/config';

export enum Severity {
  Important = 'IMPORTANT 📢',
  Critical = 'CRITICAL 🚨',
  Info = 'INFO 🧉',
}

export enum Network {
  Sepolia = 11155111,
  Ropsten = 3,
  Moonbeam = 1284,
  Moonriver = 1285,
  OptimisticKovan = 69,
  ArbitrumGoerli = 421613,
  GnosisChain = 100,
  RSKTestnet = 31,
  Optimistic = 10,
  POA = 99,
  Rinkeby = 4,
  Mainnet = 1,
  Kovan = 42,
  AvalancheFuji = 43113,
  ArbitrumRinkeby = 421611,
  FantomTestnet = 4002,
  RialtoBinance = 97,
  Goerli = 5,
  PolygonMumbai = 80001,
  Fantom = 250,
  Avalanche = 43114,
  Polygon = 137,
  OptimisticGoerli = 420,
  Cronos = 25,
  CronosTestnet = 338,
  Binance = 56,
  Arbitrum = 42161,
  RSK = 30,
}

export const BlockExplorer: Record<Network, string> = {
  [Network.Sepolia]: 'https://sepolia.etherscan.io/',
  [Network.Ropsten]: 'https://ropsten.etherscan.io',
  [Network.Moonbeam]: 'https://moonscan.io',
  [Network.Moonriver]: 'https://moonriver.moonscan.io',
  [Network.OptimisticKovan]: 'https://kovan-optimistic.etherscan.io',
  [Network.ArbitrumGoerli]: 'https://goerli.arbiscan.io',
  [Network.GnosisChain]: 'https://gnosisscan.io',
  [Network.RSKTestnet]: 'https://explorer.testnet.rsk.co',
  [Network.Optimistic]: 'https://optimistic.etherscan.io',
  [Network.POA]: 'https://blockscout.com/poa/core',
  [Network.Rinkeby]: 'https://rinkeby.etherscan.io',
  [Network.Mainnet]: 'https://etherscan.io',
  [Network.Kovan]: 'https://kovan.etherscan.io',
  [Network.AvalancheFuji]: 'https://testnet.snowtrace.io',
  [Network.ArbitrumRinkeby]: 'https://testnet.arbiscan.io',
  [Network.FantomTestnet]: 'https://testnet.ftmscan.com',
  [Network.RialtoBinance]: 'https://testnet.bscscan.com',
  [Network.Goerli]: 'https://goerli.etherscan.io',
  [Network.PolygonMumbai]: 'https://mumbai.polygonscan.com',
  [Network.Fantom]: 'https://ftmscan.com',
  [Network.Avalanche]: 'https://snowtrace.io',
  [Network.Polygon]: 'https://polygonscan.com',
  [Network.OptimisticGoerli]: 'https://goerli-optimism.etherscan.io',
  [Network.Cronos]: 'https://cronoscan.com',
  [Network.CronosTestnet]: 'https://testnet.cronoscan.com',
  [Network.Binance]: 'https://bscscan.com',
  [Network.Arbitrum]: 'https://arbiscan.io',
  [Network.RSK]: 'https://blockscout.com/rsk/mainnet',
};

export const ADDRESS_EXPLORER = (network: Network, address: Address) => {
  return `${BlockExplorer[network]}/address/${address}`;
};

export const TRANSACTION_EXPLORER = (network: Network, address: Address) => {
  return `${BlockExplorer[network]}/tx/${address}`;
};

export enum Task {
  DiscordNotification,
  TagChildContract,
}

export enum Trigger {
  Transaction = 'transaction',
  Alert = 'alert',
}

export enum TransactionTriggerFilter {
  Event,
}

export enum TenderlyMandatorySecret {
  AccessToken = 'TENDERLY_ACCESS_TOKEN',
  ProjectSlug = 'TENDERLY_PROJECT_SLUG',
  Username = 'TENDERLY_USERNAME',
  ErrorHandlerDiscordWebhook = 'DISCORD_WEBHOOK_ERROR_HANDLER',
}
