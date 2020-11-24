import * as nats from 'nats';
import { 
  INatsMessageBroker,
  INatsMessage,
  INastsRequestConfig,
  IMessageBrokerConfig,
} from "../interfaces";

import { HandleMessageBrokerFunc, SID } from '../types'

/*
@class NastsMessageBrokerImpl
@description Nats Message Broker is a wrapper of library nats
to includes logic for abstract methods to reutilize into Rest API'S
or another services if need exchange of messages between services
@author JimmyCodder
*/
export class NatsMessageBrokerImpl implements INatsMessageBroker<INatsMessage | nats.NatsError> {

  /*
  @attribute _natsClient
  @type nats.Client
  */
  private _natsClient: nats.Client

  /*
  @method connect
  @params config
  @returns Promise<void>
  @description connect into nats instance
  */
  async connect(config: IMessageBrokerConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._natsClient) return resolve()

      const nc = nats.connect(config.host)
      nc.on('connect', () => {
        this._natsClient = nc;
        resolve()
      })
      nc.on('error', error =>  reject(error))
    })
  }

  /*
  @method disconnect
  @returns void
  @description disconnect if already exists nats connection
  */
  disconnect(): void {
    this.natsClient.close()
  }

  /*
  @method publish
  @returns void
  @description publis message
  */
  publish(to: string, message: INatsMessage, callback?: HandleMessageBrokerFunc<INatsMessage | nats.NatsError>) {
    this.natsClient.publish(to, this.parseMessage(message), callback)
  }

  /*
  @method subscribe
  @returns void
  @description subscribe message
  */
  subscribe(from: string, callback?: HandleMessageBrokerFunc<INatsMessage | nats.NatsError>): SID {
    return this.natsClient.subscribe(from, (msg, reply, subject, sid) => {
      callback(this.convertMessage(msg), reply, subject, sid)
    })
  }
  
  /*
  @method unsubscribe
  @returns void
  @description unsubscribe for a consumer SID
  */
  unsubscribe(sid: SID, max: number): void {
    this.natsClient.unsubscribe(sid, max)
  }

  /*
  @method request
  @returns void
  @description request a message to enable RPC messages
  */
  request(from: string, message: INatsMessage, requestConfig: INastsRequestConfig, callback?: HandleMessageBrokerFunc<INatsMessage | nats.NatsError>): SID {

    return this.natsClient.request(from, this.parseMessage(message), (msg, reply, subject, sid) => {
      callback(this.convertMessage(msg), reply, subject, sid)
    })
  }


  /*
  @method parseMessage
  @returns Object
  @description parseMessage from string or object
  */
  private parseMessage(message: string | object) {
    return typeof message === 'string' ? message : JSON.stringify(message)
  }

  /*
  @method parseBuffer
  @returns Object
  @description parse buffer to object
  */
  private parseBuffer(messageBuffer: Buffer) {
    return this.convertMessage(messageBuffer.toString())
  }

  /*
  @method converMessage
  @returns Object
  @description convert NATS message receiver to object
  */
  private convertMessage(message: string) {
    return JSON.parse(message);
  }

  /*
  @method natsClient
  @returns nats.Client
  @description check if already has connected into nats and returns the connected instance or  throw new Error
  */
  private get natsClient(): nats.Client {
    if (!this._natsClient) {
      throw new Error("Connect to nats instance befor call methods!")
    }

    return this._natsClient
  }

}

