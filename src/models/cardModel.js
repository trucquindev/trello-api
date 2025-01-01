import Joi from 'joi';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
} from '../utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { CARD_MEMBER_ACTION } from '~/utils/constants';
// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards';
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // NHUNG DU LIEU COMMENT CUA CARD DUNG EMBEDDED VAO BANG GHI CARD
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      userDisplayName: Joi.string(),
      content: Joi.string(),
      commentedAt: Joi.date().timestamp(),
    })
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

// Create a new card

const createNew = async (data) => {
  try {
    const validData = await CARD_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: true,
    });
    // bien doi du lieu ve id
    const valueCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId),
    };
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(valueCardToAdd);
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (cardId) => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) });
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (cardId, updateData) => {
  try {
    // loc cho field tap nham khi update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName];
    });
    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId);
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};
const deleteAllByColumnId = async (columnId) => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * ĐẨY MỘT PHẦN TỬ COMMENT VÀO ĐẦU MẢNG COMMENTS
 * - TRONG JS, NGƯỢC LẠI VỚI PUSH (THÊM PHẦN TỬ VÀO CUỐI MẢNG) SẼ LÀ UNSHIFT( THÊM VÀO ĐẦU MẢNG)
 * - NHƯNG TRONG MONGO THI HIEN TAI CHI CÓ PUSH - MAC DINH VAO CUOI MANG
 * ĐỂ THÊM VÀO ĐẦU: VẪN DÙNG $PUSH , NHƯNG BỌC DATA VÀO ARRAY ĐỂ TTRONG $EACH VA CHI DINH $POSITION: 0
 */
const unshiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { comments: { $each: [commentData], $position: 0 } } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateMembers = async (cardId, incomingMemberInfor) => {
  try {
    // tạo ra biến updateCondition ban đầu là rỗng
    let updateCondition = {};

    // nếu mảng memberIds của cardId đã tồn tại và có thay đ��i
    if (incomingMemberInfor.action === CARD_MEMBER_ACTION.ADD) {
      updateCondition = {
        $push: { memberIds: new ObjectId(incomingMemberInfor.userId) },
      };
    }
    if (incomingMemberInfor.action === CARD_MEMBER_ACTION.REMOVE) {
      updateCondition = {
        $pull: { memberIds: new ObjectId(incomingMemberInfor.userId) },
      }
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(cardId) }, updateCondition, {
        returnDocument: 'after',
      });
    return result;

    // nếu có điều kiện update thì cập nhật
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteAllByColumnId,
  unshiftNewComment,
  updateMembers,
};
