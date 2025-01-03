/* eslint-disable no-console */

import express from 'express';
import exitHook from 'async-exit-hook';
import { env } from '~/config/environment';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import { corsOptions } from './config/cors';
import cors from 'cors';
import { APIs_V1 } from './routes/v1';
import cookieParser from 'cookie-parser';
import socketIo from 'socket.io';
import http from 'http';
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket';
const START_SERVER = () => {
  const app = express();
  // fix loi from disk cache cua ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/v1', APIs_V1);

  //middleware xu li loi tap trung
  app.use(errorHandlingMiddleware);

  // tao 1 server som de boc thang app cua express de lam realtime voi socketid
  const server = http.createServer(app);
  // khoi tao bien io voi server va cors
  const io = socketIo(server, { cors: corsOptions });
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket);
  });

  if (env.BUILD_MODE === 'prod') {
    server.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Production. Hello ${env.AUTHOR}, I'm running at Port: ${process.env.PORT}`
      );
    });
  } else {
    server.listen(8017, env.APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Hello ${env.AUTHOR}, I'm running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`
      );
    });
  }

  //thực hiện clean up trước khi đóng connect database
  exitHook(async () => {
    CLOSE_DB();
    console.log('MongoDB connection closed');
  });
};
//dùng IIFE - Anonymous Async Functions
// connect database thành công rồi mới start server back-end
(async () => {
  try {
    await CONNECT_DB();
    console.log('Connected to MongoDB successfully');
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
// connect database thành công rồi mới start server back-end
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB successfully'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
