import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LOG_LEVEL } from 'src/utils/constants.util';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private readonly logLevels;
  constructor(private readonly configService: ConfigService) {
    super();
    this.logLevels = this.configService.get('logLevels');
  }
  error(message: any, trace?: string, context = '') {
    // TO DO
    if (this.logLevels.includes(LOG_LEVEL.ERROR))
      super.error(message, trace, context);
  }

  warn(message: any, context = '') {
    // TO DO
    if (this.logLevels.includes(LOG_LEVEL.WARN)) super.warn(message, context);
  }

  log(message: any, context = '') {
    // TO DO
    if (this.logLevels.includes(LOG_LEVEL.LOG)) super.log(message, context);
  }

  debug(message: any, context = '') {
    // TO DO
    if (this.logLevels.includes(LOG_LEVEL.DEBUG)) super.debug(message, context);
  }

  verbose(message: any, context = '') {
    // TO DO
    if (this.logLevels.includes(LOG_LEVEL.VERBOSE))
      super.verbose(message, context);
  }
}
