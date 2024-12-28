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
Router.route('/').get(
  AuthMiddleware.isAuthorized,
  invitationController.getInvitations
);

Router.route('/board/:invitationId').put(
  AuthMiddleware.isAuthorized,
  invitationController.updateBoardInvitation
);
export const invitationRoute = Router;
