import { slugify } from '~/utils/formatterSlug'
const createNew = async(data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoar = {
      // xử lí logic dữ liệu
      // slug dùng để conver tiếng việt thành link coi them trên doc của slug
      ...data,
      slug:slugify(data.title)
    }

    //gọi tới model để lưu newboard vào database

    //trả kết quả về, trong service phải return nếu không thì có như không có
    return newBoar
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}