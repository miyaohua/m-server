import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis_host'),
            port: configService.get('redis_port')
          },
          database: 1
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    },
  ],
  exports: [RedisService],
})
export class RedisModule { }
