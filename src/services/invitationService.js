import { userModel } from '~/models/userModel';
import { boardModel } from '~/models/boardModel';
import { invitationModel } from '~/models/invitationModel';
import { BOARD_INVITATION_STATUS, INVITATION_TYPE } from '~/utils/constants';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { pickUser } from '~/utils/formatterSlug';
const createNewBoardInvitation = async (data, inviterId) => {
  try {
    // nguoi di moi chinh la nguoi dang request, lay id tu token
    const inviter = await userModel.findOneById(inviterId);
    // nguoi duoc moi: lay theo email nhan tu frontend
    const invitee = await userModel.findOneByEmail(data.inviteeEmail);
    //Tim cai board de lay data xu ly
    const board = await boardModel.findOneById(data.boardId);
    // khong ton tai 1 trong 3 thi reject
    if (!inviter || !invitee || !board) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Inviter, invitee or board not found'
      );
    }
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // chuyen object sang string vi sang model co check lai data o ham create
      type: INVITATION_TYPE.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING,
      },
    };
    // goi sang Model de luu vao db
    const createInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    );
    const getInvitation = await invitationModel.findOneById(
      createInvitation.insertedId
    );

    // ngoai thong tin cua cai board invitation moi tao thi ra ve du ca luon board, inviter, invitee cho fe thoai mai xu ly
    const resInvitation = {
      ...getInvitation,
      board,
      invitee: pickUser(invitee),
      inviter: pickUser(inviter),
    };
    return resInvitation;
  } catch (error) {
    throw error;
  }
};
const getInvitations = async (userId) => {
  try {
    const invitations = await invitationModel.getInvitationsByUserId(userId);
    console.log('🚀 ~ getInvitations ~ invitations:', invitations);
    return invitations;
  } catch (error) {
    throw error;
  }
};
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
};
