import socket from '../config/socket'
import { userJoined, userLeft, userStartedTyping, userStoppedTyping } from './users'
import { updateColor, updateId } from './general'
import { receiveMessage } from './messages';

export const init = () => (dispatch, getState) => {
  socket.on('USER_JOINED', (data) => {
    dispatch(userJoined(data))
  })

  socket.on('USER_LEFT', (data) => {
    dispatch(userLeft(data))
  })
}

export const initAll = () => (dispatch, getState) => {

  console.log(getState().general.username)

  socket.emit('ADD_USER', getState().general.username)

  socket.on('WELCOME_USER', (data) => {
    dispatch(updateColor(data.color))
    dispatch(updateId(data.id))
  })

  socket.on('USER_STARTED_TYPING', (data) => {
    dispatch(userStartedTyping(data))
  })

  socket.on('USER_STOPPED_TYPING', (data) => {
    dispatch(userStoppedTyping(data))
  })

  socket.on('RECEIVE_MESSAGE', (data) => {
    dispatch(receiveMessage(data))
  })
}