export const ALERT_SUCCESS = 'ALERT_SUCCESS';
export const ALERT_ERROR = 'ALERT_ERROR';
export const ALERT_HIDE = 'ALERT_HIDE';

const initialState = {
  success: false,
  message: '',
  error: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ALERT_SUCCESS:
      return {
        success: true,
        message: action.payload,
        error: false,
      };

    case ALERT_ERROR:
      return {
        success: false,
        message: action.payload,
        error: true,
      };

    case ALERT_HIDE:
      return {
        message: '',
        error: false,
        success: false,
      };

    default:
      return state;
  }
};
