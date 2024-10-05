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

export const columnService = {
  createNew
}