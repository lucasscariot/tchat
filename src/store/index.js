
import { combineReducers } from 'redux'
import general from './general'
import users from './users'
import messages from './messages'

const rootReducer = combineReducers({
  messages,
  general,
  users,
})

export default rootReducer