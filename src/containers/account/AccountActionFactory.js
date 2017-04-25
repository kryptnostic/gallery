import * as actionTypes from './AccountActionTypes';

export function saveAccountData(data) {
  return {
    type: actionTypes.SAVE_ACCOUNT_DATA,
    data
  };
}
