import {combineReducers} from 'redux';
import dashboard from './dashboardReducer';
import alert from './alert';
const MasterReducer = combineReducers({
  dashboard,
  alert,
});

export default MasterReducer;
