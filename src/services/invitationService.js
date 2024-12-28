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
    const resInvitations = invitations.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {},
    }));
    return resInvitations;
  } catch (error) {
    throw error;
  }
};
const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId);
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found');
    }

    // lay full thong tin cua board
    const boardId = await getInvitation.boardInvitation.boardId;
    const getBoard = await boardModel.findOneById(boardId);
    if (!getBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
    }

    // kiểm tra xem nếu status là accecpt mà join board mà thằng user đó đã là member hoặc owner thì return lỗi
    // 2 mảng ownerIds và memberIds đều là ObjectId nên trả về string để check
    const ownerIds = getBoard.ownerIds.map((id) => id.toString());
    const memberIds = getBoard.memberIds.map((id) => id.toString());
    const ownerIdsAndmemberIdsInBoard = [...ownerIds, ...memberIds];
    if (
      status === BOARD_INVITATION_STATUS.ACCEPTED &&
      ownerIdsAndmemberIdsInBoard.includes(userId)
    ) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'You cannot accept this invitation because you are already a member or owner of the board'
      );
    }

    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status,
      },
    };
    // update status boardInvitation trong invitationModel
    const updatedInvitation = await invitationModel.update(
      invitationId,
      updateData
    );
    // neu accept successfully then update add userId to memberIds in collection board
    if (
      updatedInvitation.boardInvitation.status ===
      BOARD_INVITATION_STATUS.ACCEPTED
    ) {
      await boardModel.pushMemberIds(
        updateBoardInvitation.boardInvitation.boardId,
        userId
      );
    }
    return updatedInvitation;
  } catch (error) {
    throw error;
  }
};
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
};
