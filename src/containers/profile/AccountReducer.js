import Immutable from 'immutable';
import * as actionTypes from './AccountActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  fullName: '',
  googleId: '',
  email: '',
  organizations: [],
  visibleOrganizationIds: []
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.SAVE_ACCOUNT_DATA:
      console.log('account data:', action.data.toJS());
      const { fullName, googleId, email, organizations, visibleOrganizationIds } = action.data;
      // return state.merge({
      //   fullName,
      //   googleId,
      //   email,
      //   organizations,
      //   visibleOrganizationIds
      // });
      return state.set('fullName', fullName);

    default:
      return state;
  }
}
