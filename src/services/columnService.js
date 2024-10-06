import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
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
export const columnService = {
  createNew,
  update
}