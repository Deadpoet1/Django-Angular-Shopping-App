from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

message = {'product_id': 1, 'message': 'Test message'}
future = producer.send('product_stock', message)
try:
    record_metadata = future.get(timeout=10)
    print(f'Sent Kafka message: {message} to topic {record_metadata.topic} partition {record_metadata.partition} offset {record_metadata.offset}')
except Exception as e:
    print(f'Failed to send Kafka message: {e}')
producer.flush()