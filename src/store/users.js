import { createAction, handleActions } from 'redux-actions'

const defaultState = [];

export const userJoined = createAction('USER_JOINED')
export const userLeft = createAction('USER_LEFT')
export const userStartedTyping = createAction('USER_STARTED_TYPING')
export const userStoppedTyping = createAction('USER_STOPPED_TYPING')

const reducer = handleActions(
  {
    [userJoined](state, { payload }) {
      return [...state, payload]
    },
    [userLeft](state, { payload }) {
      return [...state.map(user => ({
        ...user,
        ...(user.id === payload ? { isConnected: false } : {})
      }))]
    },
    [userStartedTyping](state, { payload }) {
      return [...state.map(user => ({
        ...user,
        ...(user.id === payload ? { isTyping: true } : {})
      }))]
    },
    [userStoppedTyping](state, { payload }) {
      return [...state.map(user => ({
        ...user,
        ...(user.id === payload ? { isTyping: false } : {})
      }))]
    },
  },
  defaultState,
)

export default reducer