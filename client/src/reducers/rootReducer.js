import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { chatSelectionReducer } from './chatSelectionReducer';
const rootReducer = combineReducers({
  user: userReducer,
  selection: chatSelectionReducer,
});

export default rootReducer;
