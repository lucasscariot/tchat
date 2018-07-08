import { createAction, handleActions } from 'redux-actions'
import socket from '../config/socket'

const defaultState = [];

export const receiveMessage = createAction('RECEIVE_MESSAGE')

export const sendMessage = (message) => (dispatch, getState) => {
  if (message === '') return

  const { color, username, id } = getState().general

  socket.emit('SEND_MESSAGE', {
    color,
    message,
    username,
    userId: id
  })

  socket.emit('STOPPED_TYPING')
}

const reducer = handleActions(
  {
    [receiveMessage](state, { payload }) {
      return [...state, payload]
    },
  },
  defaultState,
)

export default reducer