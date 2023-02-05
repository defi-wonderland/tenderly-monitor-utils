import { expect } from 'chai';
import { generateTenderlyYaml } from '../src/generators/yaml-generator';
import { testConfig, testConfigAlert } from './config/test-config';

describe('Generate YAML', () => {
  it('should have correct values', () => {
    const yaml = generateTenderlyYaml(testConfig, 'event-handler', 'org/monitor');

    const expectedYaml = `account_id: ""
project_slug: ""
actions:
  org/monitor:
    runtime: v1
    sources: .
    specs:
      TestHandlerEvents:
        function: event-handler:TestHandlerEvents
        trigger:
          type: transaction
          transaction:
            status:
              - mined
            filters:
              - network: 5
                eventEmitted:
                  contract:
                    address: "0x123"
                  name: TestEvent\n`;
    expect(yaml).to.equal(expectedYaml);
  });
});

describe('Generate YAML Alert', () => {
  it('should have correct values', () => {
    const yaml = generateTenderlyYaml(testConfigAlert, 'event-handler', 'org/monitor');

    const expectedYamlAlert = `account_id: ""
project_slug: ""
actions:
  org/monitor:
    runtime: v1
    sources: .
    specs:
      TestHandlerEvents:
        function: event-handler:TestHandlerEvents
        trigger:
          type: alert
          id: "123"\n`;
    expect(yaml).to.equal(expectedYamlAlert);
  });
});
