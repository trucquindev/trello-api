import { StatusCodes } from 'http-status-codes';
import { boardService } from '~/services/boardService';
const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;

    // điều hướng dữ liệu sang service
    const creatNewBoard = await boardService.createNew(userId, req.body);

    // trả về kết quả thành công
    res.status(StatusCodes.CREATED).json(creatNewBoard);
  } catch (error) {
    next(error);
  }
};
const getBoardDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;

    const boardId = req.params.id;
    // điều hướng dữ liệu sang service
    const getDetails = await boardService.getBoardDetails(userId, boardId);

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(getDetails);
  } catch (error) {
    next(error);
  }
};
const updateBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    // điều hướng dữ liệu sang service
    const updatedBoard = await boardService.updatedBoardService(
      boardId,
      req.body
    );

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang service
    const result = await boardService.moveCardToDifferentColumn(req.body);

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getAllBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    //page ve itemsPerPage duoc truyen vao trong query url tu phia fe nen be se lay thong qua query
    const { page, itemsPerPage, q } = req.query;
    const queryFilter = q;
    // console.log('🚀 ~ getAllBoards ~ queryFilter:', queryFilter);

    // điều hướng dữ liệu sang service
    const results = await boardService.getAllBoards(
      userId,
      page,
      itemsPerPage,
      queryFilter
    );

    // trả về kết quả thành công
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};
export const boardController = {
  createNew,
  getBoardDetails,
  updateBoard,
  moveCardToDifferentColumn,
  getAllBoards,
};
