import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
const createNew = async(data) => {
  try {
    const newCard = {
      ...data
    }
    const createdNew= await cardModel.createNew(newCard)
    const getCardCreated = await cardModel.findOneById(createdNew.insertedId)

    if (getCardCreated) {

      // Cap nhat mang columnoderids trong colection board
      await columnModel.pushCardOderIds(getCardCreated)
    }
    return getCardCreated
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}