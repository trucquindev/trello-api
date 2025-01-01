import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
import { CloudinaryProvider } from '~/providers/CloudinaryProvider';
const createNew = async (data) => {
  try {
    const newCard = {
      ...data,
    };
    const createdNew = await cardModel.createNew(newCard);
    const getCardCreated = await cardModel.findOneById(createdNew.insertedId);

    if (getCardCreated) {
      // Cap nhat mang columnoderids trong colection board
      await columnModel.pushCardOderIds(getCardCreated);
    }
    return getCardCreated;
  } catch (error) {
    throw error;
  }
};
const update = async (cardId, data, cardCoverFile, userInfo) => {
  try {
    const updateCardData = {
      ...data,
      updatedAt: Date.now(),
    };

    let updatedCard = {};
    if (cardCoverFile) {
      // cap nhat cover image cua card
      // truong hop upload leen cloud storage, (cloud binary)
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'trello/card-covers'
      );
      // luu lai url r day len db
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
      });
    } else if (updateCardData.commentToAdd) {
      // them comment vao card
      const commentData = {
        ...updateCardData.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentedAt: Date.now(),
      };
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else if (updateCardData.incomingMemberInfor) {
      // th add hoặc remove thành viên ra khỏi card
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateCardData.incomingMemberInfor
      );
    } else {
      // cac truong hop update nhu title, description ...
      updatedCard = await cardModel.update(cardId, updateCardData);
    }

    return updatedCard;
  } catch (error) {
    throw error;
  }
};
export const cardService = {
  createNew,
  update,
};
