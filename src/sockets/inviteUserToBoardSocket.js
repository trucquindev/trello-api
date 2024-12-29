export const inviteUserToBoardSocket = (socket) => {
  // lắng nge sk mà cline emit lên có tên là: FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    //Cachs lamf nhanh nhất là emit 1 sk ngược lại về cho mọi client khác ( ngoại trừ chính ng gửi request lên), rồi fe check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation);
  });
};
