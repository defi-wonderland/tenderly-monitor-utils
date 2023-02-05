import axiosRetry from 'axios-retry';
import axios, { AxiosInstance } from 'axios';
import { TenderlyActionResponse, TenderlyContractAddition } from '../types/tenderly';

export class TenderlyAPI {
  static API_LINK = 'https://api.tenderly.co/api';

  v1Client: AxiosInstance;
  v2Client: AxiosInstance;

  constructor(accessToken: string, username: string, slug: string) {
    this.v1Client = axios.create({ baseURL: `${TenderlyAPI.API_LINK}/v1/account/${username}/project/${slug}` });
    this.v2Client = axios.create({ baseURL: `${TenderlyAPI.API_LINK}/v2/accounts/${username}/projects/${slug}` });

    this.v1Client.defaults.headers.common['X-Access-Key'] = accessToken;
    this.v2Client.defaults.headers.common['X-Access-Key'] = accessToken;

    axiosRetry(this.v1Client, { retries: 3 });
    axiosRetry(this.v2Client, { retries: 3 });
  }

  /**
   * Add contract to Tenderly
   *
   * @param contractAddress address of the contract to add and tag
   * @param networkId network id of the contract
   * @param errorHandlerDiscordWebhook in case of an unexpected error, this discord webhook will get notified
   */
  async addContracts(contracts: TenderlyContractAddition[], errorHandlerDiscordWebhook?: string): Promise<void> {
    // add contract to Tenderly
    await this.v2Client.post('/contracts', { contracts }).catch(async () => {
      // handle unexpected exceptions, and send them to discord webhook
      const message = `Failed to add contracts to Tenderly: ${JSON.stringify({ contracts })}`;
      console.warn(`Unexpected error: ${message}`);

      if (errorHandlerDiscordWebhook) {
        await axios.post(errorHandlerDiscordWebhook, { content: message });
      }
    });
  }

  /**
   * Tag contract
   *
   * @param contractAddress address of the contract to add and tag
   * @param tag name of the tag
   * @param networkId network id of the contract
   * @param errorHandlerDiscordWebhook in case of an unexpected error, this discord webhook will get notified
   */
  async tagContract(contractAddress: string, tag: string, networkId: Number, errorHandlerDiscordWebhook?: string): Promise<void> {
    // tag contract
    await this.v1Client.post('/tag', { contract_ids: [`eth:${networkId}:${contractAddress}`], tag: tag }).catch(async () => {
      // handle unexpected exceptions, and send them to discord webhook
      const message = `Failed to add tag: \`${tag}\` to Tenderly, with contract: \`${contractAddress}\` and network: \`${networkId}\``;
      console.warn(`Unexpected error: ${message}`);

      if (errorHandlerDiscordWebhook) {
        await axios.post(errorHandlerDiscordWebhook, { content: message });
      }
    });
  }

  /**
   * Add contract to Tenderly, and then tag it.
   *
   * @param contractAddress address of the contract to add and tag
   * @param tag name of the tag
   * @param networkId network id of the contract
   * @param errorHandlerDiscordWebhook in case of an unexpected error, this discord webhook will get notified
   */
  async addAndTagNewContract(contractAddress: string, tag: string, networkId: Number, errorHandlerDiscordWebhook?: string): Promise<void> {
    await this.addContracts([{ address: contractAddress, network_id: String(networkId) }], errorHandlerDiscordWebhook);
    await this.tagContract(contractAddress, tag, networkId, errorHandlerDiscordWebhook);
  }

  async getProjectActions(): Promise<TenderlyActionResponse> {
    return (await this.v1Client.get<TenderlyActionResponse | null>('/actions')).data || [];
  }

  async deleteProjectActions(actions: { id: string; name: string }[]): Promise<void> {
    // loop through actions
    for (const { id, name } of actions) {
      // try to delete each action
      await this.v1Client.delete(`/actions/action/${id}`).catch((e) => {
        // log in case of error
        console.warn(`Failed to delete Tenderly action: ${name}`);
        console.error(e);
      });

      console.debug(`Tenderly action deleted: ${name}`);
    }
  }
}
