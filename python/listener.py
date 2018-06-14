#!/usr/bin/python3

import pika
import json
from collections import namedtuple

server = '192.168.1.107'
port = 5672
credentials = pika.PlainCredentials('jim','jim')
vhost = '/'
queueName = 'pythonCommandQueue'
resultsQueueName = 'pythonResultsQueue'

connection = pika.BlockingConnection(pika.ConnectionParameters(server, port, vhost, credentials))
channel = connection.channel()

channel.queue_declare(queue=queueName)


def callback(ch, method, properties, body):
    data = json.loads(body.decode('utf-8'), object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
#    requestParams = json.loads(body.decode('utf-8'))
    print(data.command)

    channel.basic_publish(exchange='', routing_key='result', body=json.dumps("{ 'result':'test'}"))


channel.basic_consume(callback, queue=queueName, no_ack=True)
channel.start_consuming()


