import { env } from '~/config/environment';

export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'https://trello-web-2024.vercel.app',
];
export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'dev' ? env.WEB_DOMAIN_DEVELOPMENT : env.WEB_DOMAIN_PROD;
