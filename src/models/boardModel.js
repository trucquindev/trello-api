import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators';
import { GET_DB } from '~/config/mongodb';
import { BOARD_TYPE } from '~/utils/constants';
import { columnModel } from './columnModel';
import { cardModel } from './cardModel';
import { pagingSkipValue } from '~/utils/algorithms';
//define collection (schema and name)

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(2).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // nhung Admin cua boards
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // nhung thanh vien cua boards
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});
// chi dinh nhung field k muon cap nhat
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const createNew = async (userId, data) => {
  try {
    const validData = await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: true,
    });
    const newBoardToAdd = {
      ...validData,
      ownerIds: [new ObjectId(userId)],
    };
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(newBoardToAdd);
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (boardId) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) });
  } catch (error) {
    throw new Error(error);
  }
};
// dung query tong hop(aggregate) de lay toan bo columns va card thuoc ve board
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/
const getDetails = async (userId, boardId) => {
  try {
    // dieu kien de query ra boards
    const queryCondition = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      // no phai la thanh vien hoac admin cua board moi duoc select ra
      {
        $or: [
          {
            ownerIds: {
              $all: [new ObjectId(userId)],
            },
          },
          {
            memberIds: {
              $all: [new ObjectId(userId)],
            },
          },
        ],
      },
    ];
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: { $and: queryCondition },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns',
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards',
          },
        },
      ])
      .toArray();
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};
// push column to collection in columnIds
// day mot phan tu columnId ra khoi mang columnOderIds
//dung pull trong mongodb de day 1 phan tu di
const pushColumnOderIds = async (dataColumn) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(dataColumn.boardId) },
        { $push: { columnOrderIds: new ObjectId(dataColumn._id) } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// lay mot phan tu columnId ra khoi mang columnOderIds
//dung pull trong mongodb de lay 1 phan tu di
const pullColumnOderIds = async (dataColumn) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(dataColumn.boardId) },
        { $pull: { columnOrderIds: new ObjectId(dataColumn._id) } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateBoard = async (boardId, updateData) => {
  try {
    // loc cho field tap nham khi update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName];
    });
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};
const getAllBoards = async (userId, page, itemsPerPag) => {
  try {
    //get boards
    // dieu kien de query ra boards
    const queryCondition = [
      { _destroy: false },
      // no phai la thanh vien hoac admin cua board moi duoc select ra
      {
        $or: [
          {
            ownerIds: {
              $all: [new ObjectId(userId)],
            },
          },
          {
            memberIds: {
              $all: [new ObjectId(userId)],
            },
          },
        ],
      },
    ];
    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          {
            $match: { $and: queryCondition },
          },
          // sort title cuar board theo A-Z - theo chuan bang ma ASCII
          {
            $sort: { title: 1 },
          },
          // $facet xu ly nhieu luon trong 1 query
          {
            // https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/facet/
            $facet: {
              //luong thu nhat: query boards
              queryBoards: [
                {
                  $skip: pagingSkipValue(page, itemsPerPag), // boa di page truoc do da select
                },
                {
                  $limit: itemsPerPag, // gio han so luong toi da so luong ban ghi tra ve trong 1 page
                },
              ],
              // luong thu hai : query dem tong so luong bang ghi boards trong db va tra ve vao bien countedBoards ma userId nay co the select
              queryTotalBoards: [
                {
                  $count: 'countedBoards',
                },
              ],
            },
          },
        ],
        // fix viec tra ve B hoa truoc a thuong
        //https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation-document-fields
        {
          collation: { locale: 'en' },
        }
      )
      .toArray();

    const res = query[0];
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedBoards || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOderIds,
  updateBoard,
  pullColumnOderIds,
  getAllBoards,
};
