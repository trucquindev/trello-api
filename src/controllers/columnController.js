
import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async(req, res, next) => {
  try {

    // điều hướng dữ liệu sang service
    const creatNewColumn = await columnService.createNew(req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewColumn)
  } catch (error) { next(error) }
}
const update = async(req, res, next) => {
  try {
    const columnId = req.params.id
    // điều hướng dữ liệu sang service
    const updatedColumn = await columnService.update(columnId, req.body)

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) { next(error) }
}
const deleteColumn = async(req, res, next) => {
  try {
    const columnId = req.params.id
    // điều hướng dữ liệu sang service
    const result = await columnService.deleteColumn(columnId)

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
export const columnController = {
  createNew,
  update,
  deleteColumn
}