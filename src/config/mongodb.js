const { MongoClient, ServerApiVersion } = require('mongodb')
import { env } from '~/config/environment'
// khởi tạo đối tượng trellodatabaseintace (null vì chưa kết nối)
let trelloDatabaseInstance = null


// khởi tạo một đối tượng client để connect tới db
const clientInstance = new MongoClient(env.MONGODB_URI, {
// copy trên doc
// có thể có serverApi hoặc không
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}
)

export const CONNECT_DB = async () => {
  // gọi kết nối tới mongodb atlas với uri đã khai báo trong thân của client
  await clientInstance.connect()
  // ket nối db xpng thì lấy tên db theo trên và gán ngược lại vào biến trello
  trelloDatabaseInstance = clientInstance.db(env.DATABASE_NAME)
}

// // function get_db này có nhiệm vụ export ra cái trello db instance sau khi đã connect thành công tới cái mongodb để chúng ta sử dụng ở nhiều nơi khác
// // lưu ý phải đảm bảo chỉ luôn gọi cái getdb này sau khi đã kết nối thành công mongodb
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('MongoDB client is not connected')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async() => {
  await clientInstance.close()
}