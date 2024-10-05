import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .post(boardValidation.createNew, boardController.createNew)
Router.route('/:id')
  .get(boardController.getBoardDetails)
  .put()
export const boardRoute =Router