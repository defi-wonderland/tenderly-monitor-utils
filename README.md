[![image](https://img.shields.io/npm/v/@defi-wonderland/tenderly-monitor-utils.svg?style=flat-square)](https://www.npmjs.org/package/@defi-wonderland/tenderly-monitor-utils)

# Wonderland Tenderly Monitor Utils

Wonderland Tenderly Monitor Utils is a utility library for defining, tracking, and maintaining Tenderly Web3Actions in a reusable and convenient way. With this library, you can define a config TypeScript file in your project to start tracking your smart contracts. The source code for the tasks and the Tenderly YAML file will be automatically generated.

## Features

- Event handler generator for generating the source code to handle the tasks of the web3 action.
- YAML generator for generating the Tenderly YAML config.
- Predefined tasks like sending Discord notifications when certain events are triggered, automatically adding Tenderly contracts, and tagging contracts.
- Supports different triggers such as transactions and alerts.

## Installation

You can install Tenderly Monitor Utils via npm or yarn:

```console
yarn add @defi-wonderland/tenderly-monitor-utils
```

## Basic Usage

Please take a look at our Monitor boilerplate for a fast setup.

```typescript
import BasicContractABI from "../abi/BasicContract.json";
import BasicFactoryABI from "../abi/BasicFactory.json";
import BasicFactoryChildABI from "../abi/BasicFactoryChild.json";
import {
  contracts,
  ContractTag,
  DiscordNotifier,
  TenderlyAlertId,
  TenderlyCustomSecret,
} from "../constants";
import {
  Severity,
  Trigger,
  TransactionTriggerFilter,
  Network,
  Task,
  HandlerConfig,
} from "@defi-wonderland/tenderly-monitor-utils";

export const basicConfig: HandlerConfig = {
  BasicContract: {
    abi: BasicContractABI,
    trigger: {
      type: Trigger.Transaction,
      filters: [
        {
          type: TransactionTriggerFilter.Event,
          network: Network.Goerli,
          contract: contracts.basicContract[Network.Goerli],
          name: "Call2",
        },
      ],
    },
    tasks: [
      {
        type: Task.DiscordNotification,
        severity: Severity.Critical,
        channelWebhookSecret: TenderlyCustomSecret.DiscordWebhookGeneral,
        notifiers: [DiscordNotifier["Here"]],
      },
    ],
  },
  BasicFactory: {
    abi: BasicFactoryABI,
    trigger: {
      type: Trigger.Transaction,
      filters: [
        {
          type: TransactionTriggerFilter.Event,
          network: Network.Goerli,
          contract: contracts.basicFactory[Network.Goerli],
          name: "BasicChildCreated",
        },
      ],
    },
    tasks: [
      {
        type: Task.TagChildContract,
        tag: ContractTag.GeneralTag,
        childAddressEventIndex: 0,
      },
      {
        type: Task.DiscordNotification,
        severity: Severity.Critical,
        channelWebhookSecret: TenderlyCustomSecret.DiscordWebhookGeneral,
        notifiers: [DiscordNotifier["Here"]],
      },
    ],
  },
  BasicFactoryChild: {
    abi: BasicFactoryChildABI,
    trigger: {
      type: Trigger.Alert,
      id: TenderlyAlertId.GeneralTenderlyAlert,
      filters: [
        {
          type: TransactionTriggerFilter.Event,
          name: "ChildEvent2",
        },
      ],
    },
    tasks: [
      {
        type: Task.DiscordNotification,
        severity: Severity.Info,
        channelWebhookSecret: TenderlyCustomSecret.DiscordWebhookGeneral,
        notifiers: [DiscordNotifier["Here"]],
      },
    ],
  },
};
```

# License

Wonderland Tenderly Monitor Utils is released under the MIT license. Feel free to use, modify,
and/or redistribute this software as you see fit. See the
[LICENSE](https://github.com/defi-wonderland/tenderly-monitor-utils-private/blob/main/LICENSE)
file for more information.

# Contributors

Maintained by [DeFi Wonderland](https://defi.sucks). Made possible by viewers like you.
