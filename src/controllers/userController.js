import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import { userService } from '~/services/userService';
import ApiError from '~/utils/ApiError';
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
    // xu ly http only cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    // xoas cookie
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(StatusCodes.OK).json({ loggedOut: true });
  } catch (error) {
    next(error);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const result = await userService.refreshToken(req.cookies?.refreshToken);
    // xu ly http only cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.FORBIDDEN,
        'Please sign in! (Error from refresh token)'
      )
    );
  }
};
const update = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const userId = req.jwtDecoded._id;
    const updatedUser = await userService.update(userId, req.body);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update,
};
