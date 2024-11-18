// https://www.npmjs.com/package/jsonwebtoken
import JWT from 'jsonwebtoken';

// function tao moi tkoen gom 3 tham so dau vao
//userinfo nhung thong tin muon dinh kem vao token
// secretSingature la chu ky bi mat ( dang 1 chuoi string ngau nhien)
// tokenLife thoi gian song cua token
const generateToken = async (userInfo, secretSingature, tokenLife) => {
  try {
    // algorithm thuat toan ma hoa mac dinh cua jwt
    return JWT.sign(userInfo, secretSingature, {
      algorithm: 'HS256',
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};
//function kiem tra 1 token co hop le hay khong
// hop le la token tao ra co dung voi chu ky bi mat secretSingature trong project hay khong
const verifyToken = async (token, secretSingature) => {
  try {
    // ham verify cua thu vien jwt
    return JWT.verify(token, secretSingature);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
