# How to user the package?

## Create a simple Publisher
```js

import { Brokers } from '@ifextech/message-broker-wrappers';

const nats = new Brokers.NatsMessageBrokerImpl()
nats.connect({ host: /* Your  host here */ })
.then(() => {
  nats.publish('to', { payload: {} }, () => /* Your logic here */)
})

```


## Create a simple Subscriber
```js

import { Brokers } from '@ifextech/message-broker-wrappers';

const nats = new Brokers.NatsMessageBrokerImpl()
nats.connect({ host: /* Your  host here */ })
.then(() => {
  nats.subscribe('to', () => /* Your logic here */)
})

```