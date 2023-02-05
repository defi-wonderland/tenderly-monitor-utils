import { expect } from 'chai';
import { Network, Severity, TransactionTriggerFilter, Trigger } from '../src/constants';
import { HandlerConfig } from '../src/types/config';
import { validateConfig } from '../src/utils/validation';
import { testAbi } from './config/test-config';

describe('config', () => {
  describe('validateConfig', () => {
    it('should throw an error if an event configured in a handler does not exist in the provided ABI', () => {
      // Define a test handler config that references a nonexistent event
      const testConfig: HandlerConfig = {
        Events: {
          abi: testAbi,
          trigger: {
            type: Trigger.Transaction,
            filters: [
              {
                type: TransactionTriggerFilter.Event,
                network: Network.Goerli,
                contract: '0x123',
                name: 'NonExistent',
              },
            ],
          },
          tasks: [],
        },
      };

      // Expect the validateConfig function to throw an error when called with the test config
      expect(() => validateConfig(testConfig)).to.throw('Error in Events: Event NonExistent not found.');
    });
  });
});
