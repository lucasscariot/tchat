import { createAction, handleActions } from 'redux-actions'

const defaultState = {
  username: 'Lucas',
  id: '',
  color: '',
}

export const submitUsername = createAction('SUBMIT_USERNAME')
export const updateColor = createAction('UPDATE_COLOR')
export const updateId = createAction('UPDATE_ID')

const reducer = handleActions(
  {
    [submitUsername](state, { payload }) {
      return { ...state, username: payload }
    },
    [updateColor](state, { payload }) {
      return { ...state, color: payload }
    },
    [updateId](state, { payload }) {
      return { ...state, id: payload }
    },
  },
  defaultState,
)

export default reducer