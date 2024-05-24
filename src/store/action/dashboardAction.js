import {GET_APP_SETTING} from '../../queries/userQueries';
import API from '../../utils/api';
import _ from 'lodash';
import {isEmpty} from '../../utils/helper';
import {query} from '../../utils/service';
// export const getDashboardDataAction = () => dispatch => {
//   console.log('dasdsdsdas');

//   dispatch({
//     type: LOADING,
//   });
//   API.post('/apis/misc/dashboard_data')
//     .then(response => {
//       if (response.data.success) {
//         let data = response.data.dashBoardData;
//         dispatch({
//           type: DASHBOARD_DATA,
//           payload: data,
//         });
//       }
//     })
//     .catch(error => {
//       console.log('error', error);
//       dispatch({
//         type: LOADING_ERROR,
//       });
//     });
// };

export const AppSettingAction = () => async dispatch => {
  const response = await query(GET_APP_SETTING);
  console.log(JSON.stringify(response), ' sett');
  try {
    if (!isEmpty(_.get(response, 'data.getSettings'))) {
      const currencyOptions = _.get(
        response,
        'data.getSettings.store.currency_options',
        {},
      );
      let crSymbol = '';
      if (
        currencyOptions.currency === 'usd' ||
        currencyOptions.currency === 'cad'
      ) {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '$ ' : ' $';
      } else if (currencyOptions.currency === 'eur') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '€ ' : ' €';
      } else if (currencyOptions.currency === 'gbp') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '£ ' : ' £';
      } else if (currencyOptions.currency === 'inr') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '₹ ' : ' ₹';
      }

      return dispatch({
        type: SETTING_DATA,
        payload: {
          store: _.get(response, 'data.getSettings.store', {}),
          currencySymbol: crSymbol,
        },
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({type: SETTING_FAIL});
  }
};

export const LOADING = 'LOADING';
export const LOADING_ERROR = 'LOADING_ERROR';
export const DASHBOARD_DATA = 'DASHBOARD_DATA';
export const SETTING_DATA = 'SETTING_DATA';
