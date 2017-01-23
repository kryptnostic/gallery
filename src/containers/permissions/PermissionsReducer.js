/* @flow */
import { Map, fromJS } from 'immutable';

import * as actionTypes from './PermissionsActionTypes';

export const LOADING_ERROR = Symbol('loading error');

const INITIAL_STATE:Map<*, *> = fromJS({
  authorizations: {},
  requestPermissionsModal: {
    show: false,
    entitySetId: null
  }
});

export default function reducer(state:Map<*, *> = INITIAL_STATE, action:Object) {
  let authorizations;

  switch (action.type) {
    case actionTypes.CHECK_AUTHORIZATION_REJECT:
      authorizations = state.get('authorizations');
      action.accessChecks.forEach(accessCheck => {
        authorizations = authorizations.setIn(accessCheck.aclKey.concat(['permissions']), LOADING_ERROR)
      });
      return state.set('authorizations', authorizations);

    case actionTypes.CHECK_AUTHORIZATION_RESOLVE:
      authorizations = state.get('authorizations');
      action.authorizations.forEach(authorization => {
        authorizations = authorizations.setIn(authorization.aclKey.concat(['permissions']), Map(authorization.permissions))
      });
      return state.set('authorizations', authorizations);

    case actionTypes.REQUEST_PERMISSIONS_MODAL_SHOW:
      return state.mergeIn(['requestPermissionsModal'], {
        show: true,
        entitySetId: action.entitySetId
      });

    case actionTypes.REQUEST_PERMISSIONS_MODAL_HIDE:
      return state.mergeIn(['requestPermissionsModal'], {
        show: false
        // Don't set entitySetId to false. Allows modal to fade away with content
      });

    default:
      return state;
  }
}
