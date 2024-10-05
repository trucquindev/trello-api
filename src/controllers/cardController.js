
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cardService } from '~/services/cardService'
const createNew = async(req, res, next) => {
  try {

    // điều hướng dữ liệu sang service
    const creatNewCard = await cardService.createNew(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewCard)
  } catch (error) { next(error) }
}
export const cardController = {
  createNew
}