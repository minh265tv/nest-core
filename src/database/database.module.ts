import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseServers = configService.get<string>('databaseServers'),
          databaseName = configService.get<string>('databaseName'),
          databaseUser = configService.get<string>('databaseUser'),
          databasePassword = configService.get<string>('databasePassword'),
          databaseReplica = configService.get<string>('databaseReplica'),
          databaseAuthSource = configService.get<string>('databaseAuthSource');
        const userPassword =
          databaseUser && databasePassword
            ? `${databaseUser}:${databasePassword}@`
            : '';
        const replica = databaseReplica ? `?replicaSet=${databaseReplica}` : '';
        let authSource = '';
        if (databaseAuthSource) {
          if (replica) {
            authSource = `&authSource=${databaseAuthSource}`;
          } else {
            authSource = `?authSource=${databaseAuthSource}`;
          }
        }
        const uri =
          'mongodb://' +
          userPassword +
          databaseServers.split(' ').join(',') +
          `/${databaseName}` +
          replica +
          authSource;
        return {
          uri,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
