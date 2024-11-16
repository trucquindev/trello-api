import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatterSlug';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { BrevoProvider } from '~/providers/BrevoProvider';
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
export const userService = {
  createNew,
};
