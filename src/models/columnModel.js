
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from './validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
// Define Collection (name & schema)

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS= ['_id', 'boardId', 'createdAt']
// Create a new column

const createNew = async(data) => {
  try {
    const validData = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: true })
    // bien doi du lieu ve id
    const valueColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(valueColumnToAdd)
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async(id) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

// push CARD to collection in CARDORDERIDS
const pushCardOderIds = async (dataCard) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { boardId: new ObjectId(dataCard.boardId),
        _id: new ObjectId(dataCard.columnId)
      },
      { $push: { cardOrderIds: dataCard._id } },
      { returnDocument:'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (columnId, updateData) => {
  try {
    // loc cho field tap nham khi update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName]
    })
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument:'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOderIds,
  update
}
