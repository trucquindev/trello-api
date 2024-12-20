import { StatusCodes } from 'http-status-codes';
import { cardService } from '~/services/cardService';
const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const creatNewCard = await cardService.createNew(req.body);

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewCard);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const cardCoverFile = req.file;
    // điều hướng dữ liệu sang service
    const updateCard = await cardService.update(
      cardId,
      req.body,
      cardCoverFile
    );

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(updateCard);
  } catch (error) {
    next(error);
  }
};
export const cardController = {
  createNew,
  update,
};
