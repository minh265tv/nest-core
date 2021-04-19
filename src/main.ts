import 'module-alias/register'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor'
import { ValidationPipe } from '@nestjs/common'
import { ValidationConfig } from '@config/validation.config'
import { useContainer } from 'class-validator'
import { ValidatorModule } from '@validators/validator.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalInterceptors(new ResponseTransformInterceptor())
  app.useGlobalPipes(new ValidationPipe(ValidationConfig))
  app.setGlobalPrefix(configService.get<string>('apiPrefix'))

  useContainer(app.select(ValidatorModule), { fallbackOnErrors: true })

  const config = new DocumentBuilder()
    .setTitle('Authorizaion API docs')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api-docs', app, document);


  const port = configService.get<number>('port')
  await app.listen(port)
}

bootstrap()
