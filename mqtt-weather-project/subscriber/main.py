import paho.mqtt.client as mqtt
import json

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    print(f"Received from {data['stationId']}: {data['temperature']}°C / {data['humidity']}% at {data['timestamp']}")

client = mqtt.Client()
client.connect("localhost", 1883, 60)
client.subscribe("weather")

client.on_message = on_message
print("Subscriber running. Waiting for data...")
client.loop_forever()
