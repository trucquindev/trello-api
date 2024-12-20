import express from 'express';
import { invitationValidation } from '~/validations/invitationValidation';
import { invitationController } from '~/controllers/invitationController';
import { AuthMiddleware } from '~/middlewares/authMiddleware';
const Router = express.Router();

Router.route('/board').post(
  AuthMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
);

export const invitationRoute = Router;
