import { ethers } from 'ethers';
import { TransactionEvent } from '@tenderly/actions';
import { Result } from '@ethersproject/abi';

export const decodeEvent = (
  txEvent: TransactionEvent,
  ifc: ethers.utils.Interface,
  eventName: string,
  decodeParams: string[]
): { data: Result; address: string } => {
  const eventTopic = ifc.getEventTopic(eventName);
  const eventLog = txEvent.logs.find((log) => {
    return log.topics.find((topic) => topic == eventTopic) !== undefined;
  });

  if (eventLog == undefined) {
    throw Error(`${eventName} Event missing`);
  }

  return {
    data: ethers.utils.defaultAbiCoder.decode(decodeParams, eventLog.data),
    address: eventLog.address,
  };
};
