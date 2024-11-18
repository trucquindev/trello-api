import express from 'express';
import { boardValidation } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';
import { AuthMiddleware } from '~/middlewares/authMiddleware';
const Router = express.Router();

Router.route('/').post(
  AuthMiddleware.isAuthorized,
  boardValidation.createNew,
  boardController.createNew
);
Router.route('/:id')
  .get(
    AuthMiddleware.isAuthorized,
    AuthMiddleware.isAuthorized,
    boardController.getBoardDetails
  )
  .put(
    AuthMiddleware.isAuthorized,
    boardValidation.updateBoard,
    boardController.updateBoard
  );

Router.route('/supports/moving_card').put(
  AuthMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
);
export const boardRoute = Router;
