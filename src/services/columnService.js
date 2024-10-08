import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = async(data) => {
  try {
    const newColumn = {
      ...data
    }
    const createdNew= await columnModel.createNew(newColumn)
    const getColumnCreated = await columnModel.findOneById(createdNew.insertedId)

    if (getColumnCreated) {
      getColumnCreated.cards = [],

      // Cap nhat mang columnoderids trong colection board
      await boardModel.pushColumnOderIds(getColumnCreated)
    }
    return getColumnCreated
  } catch (error) {
    throw error
  }
}
const update = async(columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {

    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    //gọi tới model để lưu newboard vào database
    const updateColumn= await columnModel.update(columnId, updateData)
    //trả kết quả về, trong service phải return nếu không thì có như không có
    return updateColumn
    // return newBoard
  } catch (error) {
    throw error
  }
}
const deleteColumn = async(columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    //xoa column
    await columnModel.deleteOneById(columnId)
    //xoa toan bo card thuoc column
    await cardModel.deleteAllByColumnId(columnId)

    // xoa columnId trong mang columnOderIds
    await boardModel.pullColumnOderIds(targetColumn)
    return { deleteResult: 'Column deleted successfully !', err:0 }
  } catch (error) {
    throw error
  }
}
export const columnService = {
  createNew,
  update,
  deleteColumn
}