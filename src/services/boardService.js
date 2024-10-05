import { slugify } from '~/utils/formatterSlug'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
const createNew = async(data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      // xử lí logic dữ liệu
      // slug dùng để conver tiếng việt thành link coi them trên doc của slug
      ...data,
      slug:slugify(data.title)
    }

    //gọi tới model để lưu newboard vào database
    const createdNew= await boardModel.createNew(newBoard)

    const getBoardCreated = await boardModel.findOneById(createdNew.insertedId)
    //trả kết quả về, trong service phải return nếu không thì có như không có
    return getBoardCreated
    // return newBoard
  } catch (error) {
    throw error
  }
}
const getBoardDetails = async(boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {

    //gọi tới model để lưu newboard vào database
    const board= await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    const resBoard = cloneDeep(board)
    // dua card ve dung column cua no
    resBoard.columns?.forEach( column => {
      return column.cards = resBoard?.cards?.filter(card => card.columnId.toString() === column._id.toString())
      // return column.cards = column.cardOrderIds.map(cardId => resBoard.cards.filter(card => card._id.toString() === cardId.toString()))
    })
    // đã bỏ card vào column nên phải xóa khỏi board
    delete resBoard.cards
    //trả kết quả về, trong service phải return nếu không thì có như không có
    return resBoard
    // return newBoard
  } catch (error) {
    throw error
  }
}
const updatedBoardService = async(boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {

    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    //gọi tới model để lưu newboard vào database
    const updateBoard= await boardModel.updateBoard(boardId, updateData)
    //trả kết quả về, trong service phải return nếu không thì có như không có
    return updateBoard
    // return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getBoardDetails,
  updatedBoardService
}