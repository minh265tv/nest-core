import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as RedisPackageModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule,
    RedisPackageModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('sentinelRedis')) {
          const sentinels = [];
          for (const s of configService
            .get<string>('sentinelRedis')
            .split(' ')) {
            sentinels.push({
              host: s.split(':')[0],
              port: s.split(':')[1],
            });
          }
          return {
            config: {
              sentinels,
              name: configService.get<string>('nameClusterRedis'),
              password: configService.get<string>('passClusterRedis'),
              keyPrefix: configService.get<string>('prefixRedis'),
              db: configService.get<number>('dbRedis'),
            },
          };
        }

        return {
          config: {
            host: configService.get<string>('hostRedis'),
            port: configService.get<number>('portRedis'),
            password: configService.get<string>('passRedis'),
            keyPrefix: configService.get<string>('prefixRedis'),
            db: configService.get<number>('dbRedis'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
