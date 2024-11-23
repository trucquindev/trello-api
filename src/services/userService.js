import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatterSlug';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { BrevoProvider } from '~/providers/BrevoProvider';
import { env } from '~/config/environment';
import { JwtProvider } from '~/providers/JwtProvider';
const createNew = async (reqBody) => {
  try {
    // Kieemr tra xem email da ton tai chua
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (existsUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
    }

    //tao data de luu vao db
    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4(),
    };

    // luu thong tin user vao db
    const createdNew = await userModel.createNew(newUser);
    const getUserCreated = await userModel.findOneById(createdNew.insertedId);
    //gui email cho nguoi dung xac thuc tai khoan
    const verificationLink = `${WEBSITE_DOMAIN}/accounts/verification?email=${getUserCreated.email}&token=${getUserCreated.verifyToken}`;
    const customSubject =
      'Trello: Please verify your email before using my services!';
    const htmlContent = `
      <h3> Hello: ${getUserCreated.username} </h3>
      <h3> Here is your verification link: </h3>
      <h3> ${verificationLink}</h3>
      <h3>Sincerely, <br/> -TrucQuinDev - Một lập trình viên!</h3>
    `;
    // GOI TO PROVIDER GUI MAIL
    await BrevoProvider.sendEmail(
      getUserCreated.email,
      getUserCreated.username,
      customSubject,
      htmlContent
    );
    // tra ve du lieu cho controller
    return pickUser(getUserCreated);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    //query user trong db
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    //kiem tra can thiet
    if (!existsUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    if (existsUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Account is already verify'
      );
    if (reqBody.token !== existsUser.verifyToken)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid');
    //sau khi kiem tra thi update user de verify account
    const updateUserData = {
      isActive: true,
      verifyToken: null,
    };
    const updatedUser = await userModel.update(existsUser._id, updateUserData);
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};
const login = async (reqBody) => {
  try {
    //query user trong db
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    //kiem tra can thiet
    if (!existsUser)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    if (!existsUser.isActive)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Unverified account');
    if (!bcryptjs.compareSync(reqBody.password, existsUser.password))
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your email or password is incorrect'
      );
    // neu ok thi bat dau tao token dang nhap de tra ve cho phia fe
    // thong tin dinh kem trong jwt bao gom _id va email cua user
    const userInfo = {
      _id: existsUser._id,
      email: existsUser.email,
    };

    // Tao ra 2 loai token la accessToken va refreshToken de tra ve phia fe
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SCRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SCRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );
    // tra ve thong tin user kem voi 2 cai token vua tao ra
    return {
      accessToken,
      refreshToken,
      ...pickUser(existsUser),
    };
  } catch (error) {
    throw error;
  }
};
const refreshToken = async (clientRefreshToken) => {
  try {
    // gia ma xem token co hop le khong
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SCRET_SIGNATURE
    );

    // chung ta luu thong tin unique va co dinh cua user trong token rooi vi vay co the lay luon tu decoded ra
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    // Tao accres token moi
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SCRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    return { accessToken };
  } catch (error) {
    throw error;
  }
};
const update = async (userId, reqBody) => {
  try {
    //
    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!user.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active'
      );
    let updateUser = {
      //
    };
    // truong hop change password
    if (reqBody.current_password && reqBody.new_password) {
      // kiem tra xem current password co dung hay khong
      if (!bcryptjs.compareSync(reqBody.current_password, user.password)) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          'Your current password is incorrect'
        );
      }
      // hash new password
      updateUser = await userModel.update(user._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8),
      });
    } else {
      // th update cac thong tin chung nhu displayName
      updateUser = await userModel.update(user._id, reqBody);
    }
    return pickUser(updateUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
};
