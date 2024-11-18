import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const createdUser = await userService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const verifyAccount = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const result = await userService.verifyAccount(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const result = await userService.login(req.body);
    console.log('🚀 ~ login ~ result:', result);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  verifyAccount,
  login,
};
