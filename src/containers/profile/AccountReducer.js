import Immutable from 'immutable';
import * as actionTypes from './AccountActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  fullName: '',
  googleId: '',
  email: ''
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.SAVE_ACCOUNT_DATA:
    console.log('account data reducer:', action.data.toJS());
      return state.set('fullName', action.data.get('fullName'))
        .set('googleId', action.data.get('googleId'))
        .set('email', action.data.get('email'));

    default:
      return state;
  }
}
