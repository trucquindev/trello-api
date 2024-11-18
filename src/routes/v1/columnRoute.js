import express from 'express';
import { columnValidation } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';
import { AuthMiddleware } from '~/middlewares/authMiddleware';
const Router = express.Router();

Router.route('/').post(
  AuthMiddleware.isAuthorized,
  columnValidation.createNew,
  columnController.createNew
);

Router.route('/:id')
  .put(
    AuthMiddleware.isAuthorized,
    columnValidation.update,
    columnController.update
  )
  .delete(
    AuthMiddleware.isAuthorized,
    columnValidation.deleteColumn,
    columnController.deleteColumn
  );

export const columnRoute = Router;
