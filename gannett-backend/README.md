# gannett-backend

This directory contains two separate apps, a backend app responsible for keeping
track of inputs, which it receives from events over RabbitMQ, and an HTTP API,
which interacts with the backend server over RabbitMQ and provides web clients
the ability to interact with the backend service without having to know the
underlying RabbitMQ configuration.

## Getting Started

### Prerequisites

- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Foreman](https://github.com/strongloop/node-foreman) (`npm -g install foreman`)

### Developing

1. Run `npm install` to install server dependencies.

2. Run `rabbitmq-server` in a shell to run an amqp server, which the backend communicates with.

3. Run `nf start` to start the backend and api apps.

### API Endpoints

#### `POST /api/v1/add?number={n}`

Directs the backend to add a number to its array of inputs.

number n may be a float or an integer.

#### `GET /api/v1/inputs`

Returns the list of inputs that have received so far.

#### `GET /api/v1/sum`

Returns the sum of the inputs.

### Tests

To run tests, simply run `gulp test`

### Code Coverage

To run tests and receive code coverage reports, run `gulp test:coverage`

(Note: there's an issue with `istanbul`, the code coverage checker, and gulp.
You may have to use ctrl+c to manually kill the pipeline once the tests have completed.)

### Notes

- Because we're running regular queues instead of exchanges, which have messages
distributed to consumers on a round-robin basis, setting up multiple api servers
will lead to a condition where replies may be sent to the wrong server, leading
to timeouts for the client, and memory leaks on the server as uncalled functions
will fill up the API's RPC callback store.
