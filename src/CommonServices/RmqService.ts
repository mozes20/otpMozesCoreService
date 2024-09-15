import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    if (this.client && this.client.close) {
      this.client.close();
    }
  }

  private connect() {
    const options: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'core_queue',
        queueOptions: {
          durable: true,
        },
      },
    };

    this.client = ClientProxyFactory.create(options);

    this.client
      .connect()
      .then(() => console.log('Connected to RabbitMQ'))
      .catch((err) => {
        console.error('Failed to connect to RabbitMQ', err);
        setTimeout(() => this.connect(), 5000); // Retry connection after 5 seconds
      });

    if (this.client.addListener) {
      this.client.addListener('close', () => {
        console.error('RabbitMQ connection closed. Reconnecting...');
        this.connect();
      });
    } else {
      console.error('Client does not support event listeners');
    }
  }
}
