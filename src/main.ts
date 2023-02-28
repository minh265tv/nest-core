import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';
import { useContainer } from 'class-validator';
import { ValidationConfig } from './config/validation.config';
import { ValidatorModule } from './validators/validator.module';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';
import { NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      ...ValidationConfig,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );
  app.setGlobalPrefix(configService.get<string>('apiPrefix'));

  useContainer(app.select(ValidatorModule), { fallbackOnErrors: true });
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  }));
  app.enableCors();


  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Home Api Document')
      .setVersion('1.0')
      .setDescription(
        `
        Api Success Response: {
          data: any,
          timestamp: number
        }
        Api Error Response:{
          "statusCode": number,
          "message": string,
          "error": string,
          "timestamp": number
        }
      `,
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);

    const forwardedPrefixSwagger = (
      req: any,
      _: Response,
      next: NextFunction,
    ) => {
      req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
      next();
    };

    app.use(
      '/docs/',
      forwardedPrefixSwagger,
      swaggerUi.serve,
      swaggerUi.setup(document),
    );
  }

  const port = configService.get<number>('port');
  await app.listen(port, () => {
    console.log('app is listening in port', port);
  });
}
bootstrap();
