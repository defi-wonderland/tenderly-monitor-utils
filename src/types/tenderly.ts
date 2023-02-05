import { Address } from './config';

export interface TenderlyYAML {
  account_id: string;
  actions: Record<string, TenderlyAction>;
  project_slug: string;
}

export interface TenderlyAction {
  runtime: string;
  sources: string;
  specs: Record<string, TenderlyActionSpec>;
}

export interface TenderlyActionSpec {
  description?: string;
  function: string;
  trigger: TenderlyTrigger;
}

export type TenderlyTrigger = TenderlyTransactionTrigger | TenderlyAlertTrigger;

export interface TenderlyTransactionTrigger {
  type: 'transaction';
  transaction: Transaction;
}

export interface TenderlyAlertTrigger {
  type: 'alert';
  id: string;
}

export interface Transaction {
  status: 'mined'[];
  filters: Filter[];
}

export interface Filter {
  network: number;
  eventEmitted: EventEmitted;
}

export interface EventEmitted {
  contract: Contract;
  name: string;
}

export interface Contract {
  address: string;
}

export type TenderlyActionResponse = {
  id: string;
  name: string;
  description: string;
  status: string;
  stopped: boolean;
}[];

export type TenderlyContractAddition = {
  address: Address;
  display_name?: string;
  network_id: string;
};
