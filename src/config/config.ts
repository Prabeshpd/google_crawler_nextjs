import dotenv from 'dotenv';

type ENV = 'dev' | 'test';

interface Configuration {
  env: ENV;
  port: string | number;
  cors: {
    whitelist: string[];
  };
  logger: {
    prettyPrint: boolean;
  };
  auth: {
    secret: string;
    saltRounds: string;
  };
  testAppHost: string;
}

dotenv.config();

const config: Configuration = {
  env: process.env.ENV === 'test' ? 'test' : 'dev',
  port: process.env.EXPRESS_PORT || '3000',
  cors: {
    whitelist: ['/^localhost$/'],
  },
  logger: {
    prettyPrint: process.env.ENV !== 'production',
  },
  auth: {
    secret: process.env.NEXT_AUTH_SECRET || 'ENTER_NEXT_AUTH_SECRET',
    saltRounds: '11',
  },
  // Request  in Next.JS > 13 does not support the query attribute, hence requires a fully qualified URL
  testAppHost: process.env.TEST_APP_HOST || 'http://localhost:3000',
};

export default config;
