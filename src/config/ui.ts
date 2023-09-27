interface uiConfig {
  SERVER_URL: string;
}

const config: uiConfig = {
  SERVER_URL: process.env.REACT_BASE_ENV_URL || 'http://localhost:3000/api/v1',
};

export default config;
