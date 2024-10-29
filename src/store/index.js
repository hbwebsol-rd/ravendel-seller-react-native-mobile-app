import {createStore, applyMiddleware, compose} from 'redux';
import {thunk} from 'redux-thunk';
import MasterReducer from './reducer';

const middlewares = [
  /* other middlewares */
];

// if (__DEV__) {
//   const createDebugger = require('redux-flipper').default;
//   const thunk = require('redux-thunk').default;
//   middlewares.push(createDebugger());
//   middlewares.push(thunk);
// }
const initialState = {};

let store = createStore(
  MasterReducer,
  initialState,
  compose(applyMiddleware(thunk)),
);
// const store = createStore(MasterReducer, applyMiddleware(...thunk));

export default store;
