import { ConfigType } from '@types';
import Development from './env/Development';

const env = process.env.NODE_ENV;

function getConfig(): ConfigType {
  switch (env) {
    case 'development':
      return Development;
    case 'production':
      // TODO: Add production environment
      return {} as any;
    default:
      return Development;
  }
}

export default getConfig();
