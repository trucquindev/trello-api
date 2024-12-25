import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators';
import { BOARD_INVITATION_STATUS, INVITATION_TYPE } from '~/utils/constants';

import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { userModel } from './userModel';
import { boardModel } from './boardModel';
// Define Collection (name & schema)
const INVITATION_COLLECTION_NAME = 'invitations';
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  //kieu cua cai loi moi invitation
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPE)),

  //lOI MOI LA BOARD THI SE LUU THEM DU LIEU BOARDINVITAION - OPTIONAL
  boardInvitation: Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS)),
  }).optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = [
  '_id',
  'inviterId',
  'inviteeId',
  'type',
  'createdAt',
];

// Create a new card

const createNewBoardInvitation = async (data) => {
  try {
    const validData = await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: true,
    });
    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId),
    };
    // neu ton tai du lieu boardInvitation thi update cho cai boardId
    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId),
      };
    }
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .insertOne(newInvitationToAdd);
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (invitationId) => {
  try {
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(invitationId) });
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (invitationId, updateData) => {
  try {
    // loc cho field tap nham khi update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName];
    });
    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId),
      };
    }
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(invitationId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};
// dung query tong hop(aggregate) de lay toan bo loi moi thuoc ve 1 user cu the
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/
const getInvitationsByUserId = async (userId) => {
  try {
    const queryCondition = [
      { inviteeId: new ObjectId(userId) },
      { _destroy: false },
    ];
    const results = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .aggregate([
        {
          $match: { $and: queryCondition },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'inviterId',
            foreignField: '_id',
            as: 'inviter',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'inviteeId',
            foreignField: '_id',
            as: 'invitee',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: 'boardInvitation.boardId', // thong tin cua board
            foreignField: '_id',
            as: 'board',
          },
        },
      ])
      .toArray();
    return results;
  } catch (error) {
    throw new Error(error);
  }
};
export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update,
  getInvitationsByUserId,
};
