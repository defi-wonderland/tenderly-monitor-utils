import axios from 'axios';
import { ethers } from 'ethers';
import { decodeEvent } from './ethers';
import { ABI, TaskFunction, Filters } from '../types/config';
import { ActionFn, Context, TransactionEvent, Event } from '@tenderly/actions';
import { ADDRESS_EXPLORER, TRANSACTION_EXPLORER, Network, TenderlyMandatorySecret } from '../constants';
import { TenderlyAPI } from './tenderly-api';

export const triggerTasks = (abi: ABI, filters: Filters[], tasks: TaskFunction[]): ActionFn => {
  return async (context: Context, event: Event) => {
    // It will trigger the tasks only if the filters include any of the log names
    const { parsedLogs } = getEventElements(event, abi);
    const filterNames = filters.map((filter) => filter.name);
    let processEvent = !!parsedLogs.find((log) => filterNames.includes(log.name));

    if (!processEvent) return;

    for (let task of tasks) {
      await task(context, event, abi);
    }
  };
};

const getEventElements = (event: Event, abi: ABI) => {
  const txEvent = event as TransactionEvent;
  const ifc = new ethers.utils.Interface(abi);
  /**
   * For each log topic it will try to find an event definition by any means necessary
   */
  const parsedLogs = txEvent.logs
    .map((log) => {
      return log.topics.flatMap((t) => {
        try {
          return ifc.getEvent(t);
        } catch (e) {
          return [];
        }
      });
    })
    .flat();

  return { txEvent, ifc, parsedLogs };
};

const processLog = (log: ethers.utils.EventFragment, txEvent: TransactionEvent, ifc: ethers.utils.Interface) => {
  const eventName = log.name;
  const decodedEvent = decodeEvent(
    txEvent,
    ifc,
    eventName,
    log.inputs.map((p) => p.type)
  );
  const networkId: Network = Number(txEvent.network);

  return { eventName, decodedEvent, networkId };
};

export const notifyDiscordTask = (channelSecretKey: string, severity: string, notifiers: string[]): TaskFunction => {
  return async (context, event, abi) => {
    const channel = await context.secrets.get(channelSecretKey);
    const { txEvent, ifc, parsedLogs } = getEventElements(event, abi);

    let messages: string[] = parsedLogs.map((log) => {
      const { eventName, decodedEvent, networkId } = processLog(log, txEvent, ifc);
      return `${notifiers.join(' ')}
**Monitored event triggered**
**Severity: ${severity}**

Transaction: ${TRANSACTION_EXPLORER(networkId, txEvent.hash)}
Contract: ${ADDRESS_EXPLORER(networkId, decodedEvent.address)}
Event name: ${eventName}
Params: ${decodedEvent.data.map((arg) => `\`${arg}\``).join(', ')}
`;
    });

    // send message through discord webhook
    await axios.post(channel, {
      content: messages.join('\n\n---\n\n'),
    });
  };
};

export const addAndTagChildContractTask = (tag: string, childAddressEventIndex: number): TaskFunction => {
  return async (context: Context, event: Event, abi: ABI) => {
    const errorHandlerDiscordWebhook = await context.secrets.get(TenderlyMandatorySecret.ErrorHandlerDiscordWebhook);
    const api = new TenderlyAPI(
      await context.secrets.get(TenderlyMandatorySecret.AccessToken),
      await context.secrets.get(TenderlyMandatorySecret.Username),
      await context.secrets.get(TenderlyMandatorySecret.ProjectSlug)
    );

    const { txEvent, ifc, parsedLogs } = getEventElements(event, abi);

    for (const log of parsedLogs) {
      const { decodedEvent, networkId } = processLog(log, txEvent, ifc);
      await api.addAndTagNewContract(decodedEvent.data[childAddressEventIndex], tag, networkId, errorHandlerDiscordWebhook);
    }
  };
};
