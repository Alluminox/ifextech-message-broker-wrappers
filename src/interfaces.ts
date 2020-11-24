import { HandleMessageBrokerFunc, SID } from './types'
/*
@interface IMessage Broker Config
@atributes host
@description the interface to setting form parameters
*/
export interface IMessageBrokerConfig {
  host: string
}


/*
@interface IMessage
@atributes
@methods connect, disconnect
@description Base interface to implement MessageBroker Wrapper
*/
export interface IMessageBroker {
  connect(config: IMessageBrokerConfig): Promise<void>
  disconnect(): void
}


/*
@interface INatsMessage
@description this is a interface with receice/publish message data
@author JimmyCodder
*/
export interface INatsMessage {
  payload?: object
}

/*
@interface INastsRequestConfig
@description this is a interface from set configs to RPC messages
@author JimmyCodder
*/
export interface INastsRequestConfig {
  max?: number,
  timeout?: number
}

/*
@interface INatsMessageBroker
@description this is a interface with extends with IMessageBroker and add
more methods to conclude implementation from NATS wrapper
@author JimmyCodder
*/
export interface INatsMessageBroker<T> extends IMessageBroker {

  /*
  @method publish
  @description publish into nats
  */
  publish(to: string, message: T, callback?: HandleMessageBrokerFunc<T>): void;

  /*
  @method subscribe
  @description subscribe into nats
  */
  subscribe(from: string,  callback?: HandleMessageBrokerFunc<T>): SID;


  /*
  @method request
  @description RPC into nats
  */
  request(from: string, message: T, requestConfig: INastsRequestConfig, callback?: HandleMessageBrokerFunc<T>): SID;

  /*
  @method unsubscribe
  @description unsubscribe from the message
  */
  unsubscribe(sid: SID, max?: number): void
}