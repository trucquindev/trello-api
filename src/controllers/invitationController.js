import { StatusCodes } from 'http-status-codes';
import { invitationService } from '~/services/invitationService';
const createNewBoardInvitation = async (req, res, next) => {
  try {
    // user thuc hien request nay la inviter -  nguoi di moi
    const inviterId = req.jwtDecoded._id;
    // điều hướng dữ liệu sang service
    const resInvitation = await invitationService.createNewBoardInvitation(
      req.body,
      inviterId
    );

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(resInvitation);
  } catch (error) {
    next(error);
  }
};
const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const resInvitation = await invitationService.getInvitations(userId);

    res.status(StatusCodes.OK).json(resInvitation);
  } catch (error) {
    next(error);
  }
};
const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { invitationId } = req.params;
    const { status } = req.body;
    // điều hướng dữ liệu sang service
    const updateInvitation = await invitationService.updateBoardInvitation(
      userId,
      invitationId,
      status
    );

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(updateInvitation);
  } catch (error) {
    next(error);
  }
};
export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
};
