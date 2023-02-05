import * as YAML from 'yaml';
import { Trigger } from '../constants';
import { HandlerConfig, HandlerTrigger } from '../types/config';
import { TenderlyYAML, TenderlyAction, TenderlyTrigger } from '../types/tenderly';

export const generateTenderlyYaml = (config: HandlerConfig, handlerFileName: string, projectName: string): string => {
  const specs: TenderlyAction['specs'] = Object.entries(config).reduce((specs, [handlerName, handlerConfig]) => {
    return {
      ...specs,
      [handlerName]: {
        function: `${handlerFileName}:${handlerName}`,
        trigger: parseTriggerToYamlFormat(handlerConfig.trigger),
      },
    };
  }, {});

  const contents: TenderlyYAML = {
    account_id: '',
    project_slug: '',
    actions: {
      [projectName]: {
        runtime: 'v1',
        sources: '.',
        specs,
      },
    },
  };

  const doc = new YAML.Document();
  doc.contents = contents as any;
  return doc.toString();
};

function parseTriggerToYamlFormat(trigger: HandlerTrigger): TenderlyTrigger {
  if (trigger.type === Trigger.Transaction) {
    return {
      type: trigger.type,
      transaction: {
        status: ['mined'],
        filters: trigger.filters.map((filter) => ({
          network: filter.network,
          eventEmitted: {
            contract: {
              address: filter.contract,
            },
            name: filter.name,
          },
        })),
      },
    };
  } else {
    return {
      type: trigger.type,
      id: trigger.id,
    };
  }
}
