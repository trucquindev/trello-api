import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import ApiError from '~/utils/ApiError';
import {
  LIMIT_COMMON_FILE_SIZE,
  ALLOW_COMMON_FILE_TYPES,
} from '~/utils/validators';
//https://www.npmjs.com/package/multer

// fuction kiem tra file nào được chấp nhận
const customFileFilter = (req, file, callback) => {
  // Hàm này sẽ gọi `cb` với giá trị boolean
  // để chỉ ra liệu tệp có được chấp nhận hay không
  // console.log('multer file: ', file);

  //Đối với thằng multer kiểm tra kiểu file thì dùng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png';
    // Để từ chối tệp này, hãy truyền `false`, như sau:
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage),
      null
    );
  }
  // neu nhu kieu file hop le
  return callback(null, true);
};

// khoi tao function upload duoc boc boi thang multer
const upload = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE,
  },
  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = { upload };
