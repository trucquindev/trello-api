import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';
import { AuthMiddleware } from '~/middlewares/authMiddleware';
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware';
const Router = express.Router();

Router.route('/').post(
  AuthMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
);
Router.route('/:id').put(
  AuthMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single('cardCover'),
  cardValidation.update,
  cardController.update
);

export const cardRoute = Router;
