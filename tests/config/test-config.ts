import { Severity, Trigger, TransactionTriggerFilter, Network, Task } from '../../src/constants';
import { HandlerConfig } from '../../src/types/config';

export const testAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_testInput',
        type: 'uint256',
      },
    ],
    name: 'TestEvent',
    type: 'event',
  },
];

export const testConfig: HandlerConfig = {
  TestHandlerEvents: {
    abi: testAbi,
    trigger: {
      type: Trigger.Transaction,
      filters: [
        {
          type: TransactionTriggerFilter.Event,
          network: Network.Goerli,
          contract: '0x123',
          name: 'TestEvent',
        },
      ],
    },
    tasks: [
      {
        type: Task.DiscordNotification,
        severity: Severity.Critical,
        channelWebhookSecret: 'TEST_WEBHOOK',
        notifiers: ['<@something>'],
      },
    ],
  },
};

export const testConfigAlert: HandlerConfig = {
  TestHandlerEvents: {
    abi: testAbi,
    trigger: {
      type: Trigger.Alert,
      id: '123',
      filters: [
        {
          type: TransactionTriggerFilter.Event,
          name: 'TestEvent',
        },
      ],
    },
    tasks: [
      {
        type: Task.DiscordNotification,
        severity: Severity.Critical,
        channelWebhookSecret: 'TEST_WEBHOOK',
        notifiers: ['<@something>'],
      },
    ],
  },
};
