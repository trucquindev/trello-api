
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { columnService } from '~/services/columnService'
const createNew = async(req, res, next) => {
  try {

    // điều hướng dữ liệu sang service
    const creatNewColumn = await columnService.createNew(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewColumn)
  } catch (error) { next(error) }
}
export const columnController = {
  createNew
}