/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './config/cors'
import cors from 'cors'
import { APIs_V1 } from './routes/v1'
// import { mapOrder } from '~/utils/sorts.js'


const START_SERVER = () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended:true }))
  app.use('/v1', APIs_V1)

  //middleware xu li loi tap trung
  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE==='prod') {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production. Hello ${env.AUTHOR}, I'm running at Port: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Hello ${env.AUTHOR}, I'm running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

  //thực hiện clean up trước khi đóng connect database
  exitHook(async () => {
    CLOSE_DB()
    console.log('MongoDB connection closed')
  })
}
//dùng IIFE - Anonymous Async Functions
// connect database thành công rồi mới start server back-end
(async() => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB successfully')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
// connect database thành công rồi mới start server back-end
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB successfully'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })