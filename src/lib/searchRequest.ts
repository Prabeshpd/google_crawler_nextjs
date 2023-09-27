import axios, { InternalAxiosRequestConfig } from 'axios';

const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 1000;
export const USER_AGENT_HEADER = 'User-Agent';

export const USER_AGENTS: string[] = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
];

export const getUserAgentHeader = () => {
  const randomNumber = Math.floor(Math.random() * USER_AGENTS.length);

  return USER_AGENTS[randomNumber];
};

const searchRequest = axios.create();

searchRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status >= 500) {
      const config = error.config;
      config.retryCount = config.retryCount || 0;

      if (config.retryCount < MAX_RETRY_ATTEMPTS) {
        const delay = Math.pow(2, config.retryCount) * BASE_RETRY_DELAY_MS;
        config.retryCount += 1;
        return new Promise((resolve) => setTimeout(() => resolve(axios.request(config)), delay));
      }
    }
    return Promise.reject(error);
  }
);

searchRequest.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  if (!request.headers[USER_AGENT_HEADER]) {
    request.headers[USER_AGENT_HEADER] = getUserAgentHeader();
  }

  return request;
});

export default searchRequest;
