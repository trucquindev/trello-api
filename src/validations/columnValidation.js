
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../models/validators'


const createNew = async(req, res, next) => {
  // bắt buộc phải validation ở be vì be là điểm cuối để lưu vào db nên phải đảm bảo về mặt dữ liệu
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })
  try {

    // set abortEarly false de truong hop nhieu loi thi tra ve tat ca
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async(req, res, next) => {
  // bắt buộc phải validation ở be vì be là điểm cuối để lưu vào db nên phải đảm bảo về mặt dữ liệu
  // k dungf required trong update
  const correctCondition = Joi.object({
    // neu can lam tinh nang move column sang board khac thi co boardId bay gio tam thoi chua can dung
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })
  try {
    // set abortEarly false de truong hop nhieu loi thi tra ve tat ca
    // cho phep allowunknow de k can day len 1 so field
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const columnValidation = {
  createNew,
  update
}