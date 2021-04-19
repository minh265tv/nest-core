import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('databaseUrl'),
        database: configService.get<string>('databaseName'),
        entities: [
          User,
        ],
        useUnifiedTopology: true,
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
  ]
})
export class DatabaseModule {
}
