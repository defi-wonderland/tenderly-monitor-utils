import { Trigger } from '../constants';
import { ABI, HandlerConfig } from '../types/config';

export function validateConfig(config: HandlerConfig): void {
  // validate that events configured exist in provided abi
  Object.entries(config).forEach(([handlerName, handlerConfig]) => {
    if (handlerConfig.trigger.type === Trigger.Transaction) {
      handlerConfig.trigger.filters.forEach((filter) => {
        if (!eventExistsInABI(handlerConfig.abi, filter.name)) {
          throw new Error(`Error in ${handlerName}: Event ${filter.name} not found.`);
        }
      });
    }
  });
}

function eventExistsInABI(abi: ABI, eventName: string): boolean {
  return !!abi.find((element) => element.name === eventName && element.type === 'event');
}
