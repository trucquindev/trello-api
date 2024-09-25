
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = async(req, res, next) => {
  try {
    console.log('req.body', req.body)
    throw new ApiError(StatusCodes.BAD_GATEWAY,'hi error')
    // res.status(StatusCodes.CREATED).json({ message: 'post from controller: create new boards' })
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}