
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) => {
  // bắt buộc phải validation ở be vì be là điểm cuối để lưu vào db nên phải đảm bảo về mặt dữ liệu
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    console.log('req.body', req.body)

    // set abortEarly false de truong hop nhieu loi thi tra ve tat ca
    await correctCondition.validateAsync(req.body, { abortEarly: false})
    res.status(StatusCodes.CREATED).json({ message: 'post from validation: create new boards' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}