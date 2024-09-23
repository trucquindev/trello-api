/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
// import { mapOrder } from '~/utils/sorts.js'


const START_SERVER = () => {
  const app = express()

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I'm running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

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