import { expect } from 'chai';
import { generateEventHandlerTs } from '../src/generators/event-handler-generator';
import { testConfig, testConfigAlert, testAbi } from './config/test-config';

describe('Generate event-handler', () => {
  it('should have correct values', () => {
    const eventHandlerTs = generateEventHandlerTs(testConfig);

    const expectedEventHandlerTs = `import { triggerTasks, notifyDiscordTask, addAndTagChildContractTask } from '@defi-wonderland/tenderly-monitor-utils';
export const TestHandlerEvents = triggerTasks(
  ${JSON.stringify(testAbi)},
  ${JSON.stringify(testConfig.TestHandlerEvents.trigger.filters)},
  [
    notifyDiscordTask("TEST_WEBHOOK", "CRITICAL 🚨", ["<@something>"])
  ]
);\n`;

    expect(eventHandlerTs).to.equal(expectedEventHandlerTs);
  });
});

describe('Generate event-handler alert', () => {
  it('should have correct values', () => {
    const eventHandlerTs = generateEventHandlerTs(testConfigAlert);
    const expectedEventHandlerAlertTs = `import { triggerTasks, notifyDiscordTask, addAndTagChildContractTask } from '@defi-wonderland/tenderly-monitor-utils';
export const TestHandlerEvents = triggerTasks(
  ${JSON.stringify(testAbi)},
  ${JSON.stringify(testConfigAlert.TestHandlerEvents.trigger.filters)},
  [
    notifyDiscordTask("TEST_WEBHOOK", "CRITICAL 🚨", ["<@something>"])
  ]
);\n`;

    expect(eventHandlerTs).to.equal(expectedEventHandlerAlertTs);
  });
});
