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

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 10;
export const INVITATION_TYPE = {
  BOARD_INVITATION: 'BOARD_INVITATION',
};
export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};
export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
};
