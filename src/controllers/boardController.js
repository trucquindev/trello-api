
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async(req, res, next) => {
  try {

    // điều hướng dữ liệu sang service
    const creatNewBoard = await boardService.createNew(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewBoard)
  } catch (error) { next(error) }
}
const getBoardDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    // điều hướng dữ liệu sang service
    const getDetails = await boardService.getBoardDetails(boardId)

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(getDetails)
  } catch (error) { next(error) }
}
const updateBoard = async(req, res, next) => {
  try {
    const boardId = req.params.id
    // điều hướng dữ liệu sang service
    const updatedBoard = await boardService.updatedBoardService(boardId, req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}
const moveCardToDifferentColumn = async(req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const result = await boardService.moveCardToDifferentColumn(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getBoardDetails,
  updateBoard,
  moveCardToDifferentColumn
}