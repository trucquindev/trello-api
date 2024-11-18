import { env } from '~/config/environment';
import { JwtProvider } from '~/providers/JwtProvider';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

// Middleware xử lý JWT Token

const isAuthorized = async (req, res, next) => {
  // Lấy token từ request
  const clientAccessToken = req.cookies?.accessToken;
  // neu clientAccessToken khong ton tai thi tra ve loi
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found')
    );
    return;
  }
  try {
    // B1: thuc hien giai ma token xem no co hop le k
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SCRET_SIGNATURE
    );
    // console.log('🚀 ~ isAuthorized ~ accessTokenDecodes:', accessTokenDecoded);
    // B2: Neu token hop le thi se can phai luu thong tin giai ma duoc vao req.jwtDecoded de su dung cho cac tang xu ly o phia sau
    req.jwtDecoded = accessTokenDecoded;
    // B3: Cho phep request di tiep
    next();
  } catch (error) {
    // console.log('🚀 ~ AuthMiddleware ~ error:', error);
    // neu access token het han thi minh tra ve ma loi cho phia fe de biet goi lai api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(
        new ApiError(StatusCodes.GONE, 'Token expired! (Please refresh token)')
      );
      return;
    }
    // neu access token khong hop le ngoai tu viec het han thi tra ve loi 401 de call api sign-out
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token invalid)')
    );
  }
};

export const AuthMiddleware = {
  isAuthorized,
};
