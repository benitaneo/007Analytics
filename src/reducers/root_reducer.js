import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
//import firebase from './data_reducer';

const rootReducer = combineReducers({
  routing: routerReducer
  //firebase
});

export default rootReducer;