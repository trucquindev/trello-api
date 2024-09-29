import { slugify } from '~/utils/formatterSlug'
import { boardModel } from '~/models/boardModel'
const createNew = async(data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      // xử lí logic dữ liệu
      // slug dùng để conver tiếng việt thành link coi them trên doc của slug
      ...data,
      slug:slugify(data.title)
    }

    //gọi tới model để lưu newboard vào database
    const createdNew= await boardModel.createNew(newBoard)

    const getBoardCreated = await boardModel.findOneById(createdNew.insertedId)

    //trả kết quả về, trong service phải return nếu không thì có như không có
    return getBoardCreated
    // return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}