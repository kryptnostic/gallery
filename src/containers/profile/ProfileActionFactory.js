import * as actionTypes from './ProfileActionTypes';

export function loadUserRequest(id :string) {
  return {
    type: actionTypes.LOAD_USER_REQUEST,
    id
  };
}

export function loadUserSuccess(user :Object) {
  return {
    type: actionTypes.LOAD_USER_SUCCESS,
    user
  };
}

export function loadUserFailure() {
  return {
    type: actionTypes.LOAD_USER_FAILURE
  };
}
