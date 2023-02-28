import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { ValidatorModule } from './validators/validator.module';
import { DatabaseModule } from './database/database.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import redisConfig from './config/redis.config';
import rabbitConfig from './config/rabbit.config';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, rabbitConfig],
    }),
    ValidatorModule,
    DatabaseModule,
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, '/locale/'),
        watch: true,
      },
      resolvers: [
        {
          use: HeaderResolver,
          options: ['lang'],
        },
      ],
    }),
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
