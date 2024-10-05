import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .post(boardValidation.createNew, boardController.createNew)
Router.route('/:id')
  .get(boardController.getBoardDetails)
  .put(boardValidation.updateBoard, boardController.updateBoard)
export const boardRoute =Router