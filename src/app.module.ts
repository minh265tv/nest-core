import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import commonConfig from '@config/common.config';
import databaseConfig from '@config/database.config';
import localeConfig from '@config/locale.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ValidatorModule } from '@validators/validator.module';
import { DatabaseModule } from './database/database.module';
import { AllExceptionFilter } from './filter/exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        commonConfig,
        localeConfig
      ],
    }),
    ValidatorModule,
    DatabaseModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
