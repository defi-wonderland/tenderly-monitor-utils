import { JsonFragment } from '@ethersproject/abi';
import { Context, Event } from '@tenderly/actions';
import { Severity, Trigger, TransactionTriggerFilter, Network, Task } from '../constants';

export type ABI = JsonFragment[];
export type Address = string;

export type HandlerConfig = Record<string, Handler>;

export type EventTransactionHandlerTriggerFilter = {
  type: TransactionTriggerFilter.Event;
  network: Network;
  contract: Address;
  name: string;
};

export type AlertHandlerTriggerFilter = {
  type: TransactionTriggerFilter.Event;
  name: string;
};

export type TransactionHandlerTriggerFilter = EventTransactionHandlerTriggerFilter;
export type Filters = TransactionHandlerTriggerFilter | AlertHandlerTriggerFilter;

export type TransactionHandlerTrigger = {
  type: Trigger.Transaction;
  filters: TransactionHandlerTriggerFilter[];
};

export type AlertHandlerTrigger = {
  type: Trigger.Alert;
  id: string;
  filters: AlertHandlerTriggerFilter[];
};

export type HandlerTrigger = AlertHandlerTrigger | TransactionHandlerTrigger;

export type DiscordHandlerTask = {
  type: Task.DiscordNotification;
  severity: Severity;
  channelWebhookSecret: string;
  notifiers: string[];
};

export type TagChildContractHandlerTask = {
  type: Task.TagChildContract;
  tag: string;
  childAddressEventIndex: number;
};

export type HandlerTask = DiscordHandlerTask | TagChildContractHandlerTask;

export type Handler = {
  abi: ABI;
  trigger: HandlerTrigger;
  tasks: HandlerTask[];
};

export declare type TaskFunction = (ctx: Context, event: Event, abi: ABI) => Promise<void>;
