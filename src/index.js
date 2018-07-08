import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import App from './views/App'
import reducer from './store'

import 'antd/dist/antd.css'

const middlewares = [thunk]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

const Wrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const store = createStore(reducer, {}, applyMiddleware(...middlewares))

render(<Wrapper store={store} />, document.getElementById('root'))