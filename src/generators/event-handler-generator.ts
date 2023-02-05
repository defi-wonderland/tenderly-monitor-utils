import { Task } from '../constants';
import { HandlerConfig } from '../types/config';

export const generateEventHandlerTs = (config: HandlerConfig): string => {
  let content: string = `import { triggerTasks, notifyDiscordTask, addAndTagChildContractTask } from '@defi-wonderland/tenderly-monitor-utils';`;
  Object.entries(config).forEach(([fnName, fnConfig]) => {
    const tasks: string[] = fnConfig.tasks.map((task) => {
      switch (task.type) {
        case Task.DiscordNotification:
          return `notifyDiscordTask(${JSON.stringify(task.channelWebhookSecret)}, ${JSON.stringify(task.severity)}, ${JSON.stringify(
            task.notifiers
          )})`;
        case Task.TagChildContract:
          return `addAndTagChildContractTask(${JSON.stringify(task.tag)}, ${JSON.stringify(task.childAddressEventIndex)})`;
      }
    });

    content += `
export const ${fnName} = triggerTasks(
  ${JSON.stringify(fnConfig.abi)},
  ${JSON.stringify(fnConfig.trigger.filters)},
  [
    ${tasks.join(',\n   ')}
  ]
);
`;
  });

  return content;
};
