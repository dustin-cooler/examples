import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import RootReducer from './reducers/root';
import RootSaga from './sagas';

import defaultState from './default-state';

// store middleware for redux-saga
const sagaMiddleware = createSagaMiddleware();
let middleware = applyMiddleware(sagaMiddleware);

// add redux devtools middleware if devtools extension is installed
let DevTools = window.devToolsExtension && window.devToolsExtension();
if (DevTools) {
  middleware = compose(middleware, DevTools);
}

// create redux store
const store = createStore(
  RootReducer,
  defaultState,
  middleware
);

// run saga middleware
sagaMiddleware.run(RootSaga);

export default store;
