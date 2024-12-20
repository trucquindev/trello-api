import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNewBoardInvitation = async (req, res, next) => {
  // bắt buộc phải validation ở be vì be là điểm cuối để lưu vào db nên phải đảm bảo về mặt dữ liệu
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string().required(),
    boardId: Joi.string().required(),
  });
  try {
    // set abortEarly false de truong hop nhieu loi thi tra ve tat ca
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
export const invitationValidation = {
  createNewBoardInvitation,
};
