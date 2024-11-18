import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';
import { AuthMiddleware } from '~/middlewares/authMiddleware';
const Router = express.Router();

Router.route('/').post(
  AuthMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
);

export const cardRoute = Router;
