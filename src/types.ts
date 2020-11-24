/*
@type SID
@description this is number returns by Nats
@author JimmyCodder
*/
export type SID = number 

/*
@type HandleMessageBrokerFunc<T>
@description this is a generic callback to returns data from the nats
@author JimmyCodder
*/
export type HandleMessageBrokerFunc<T> = (msg: T, reply?: string, subject?: string, sid?: SID) => void
