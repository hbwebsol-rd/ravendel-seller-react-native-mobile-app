import {
  DASHBOARD_DATA,
  LOADING,
  LOADING_ERROR,
  SETTING_DATA,
} from '../action/dashboardAction';

const initialState = {
  user_token: {},
  dashBoardData: '',
  setting: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    case DASHBOARD_DATA:
      return {
        ...state,
        loading: false,
        dashBoardData: action.payload,
      };
    case SETTING_DATA:
      return {
        ...state,
        loading: false,
        currencyOptions: action.payload.store.currency_options,
        currencySymbol: action.payload.currencySymbol,
      };
    case 'USER_LOGOUT':
      return {...initialState};
    default: {
      return state;
    }
  }
};
