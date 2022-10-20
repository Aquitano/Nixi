import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import * as SuperTokensConfig from '../../config';
import { AuthModuleConfig, ConfigInjectionToken } from '../config.interface';

@Injectable()
export class SupertokensService {
  // @ts-ignore
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: SuperTokensConfig.recipeList,
    });
  }
}
