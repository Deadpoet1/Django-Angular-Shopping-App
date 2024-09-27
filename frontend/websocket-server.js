const WebSocket = require('ws');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'stock-update-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'stock-update-group' });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
});

const run = async () => {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');

    await consumer.subscribe({ topic: 'product_stock', fromBeginning: false });
    console.log('Subscribed to product_stock topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Received raw Kafka message:', message.value.toString());
        try {
          const outOfStockMessage = JSON.parse(message.value.toString());
          console.log('Parsed Kafka message:', outOfStockMessage);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(outOfStockMessage));
              console.log('Sent message to WebSocket client:', outOfStockMessage);
            }
          });
        } catch (error) {
          console.error('Error processing Kafka message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

run().catch(console.error);

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing WebSocket server and Kafka consumer.');
  wss.close(() => {
    console.log('WebSocket server closed.');
  });
  await consumer.disconnect();
  console.log('Kafka consumer disconnected.');
  process.exit(0);
});
