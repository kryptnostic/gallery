import Immutable from 'immutable';
import * as actionTypes from './ProfileActionTypes';

const INITIAL_STATE :Immutable.Map = Immutable.fromJS({
  user: {
    nickname: '',
    email: ''
  }
});

export default function profileReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {
  switch (action.type) {
    case actionTypes.LOAD_USER_SUCCESS:
      return state.set('user', Immutable.fromJS(action.user));

    default:
      return state;
  }
}
