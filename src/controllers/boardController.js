
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'
const createNew = async(req, res, next) => {
  try {

    // điều hướng dữ liệu sang service
    const creatNewBoard = await boardService.createNew(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}