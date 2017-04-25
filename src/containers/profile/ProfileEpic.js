import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PrincipalsApi } from 'loom-data';

import * as actionTypes from './ProfileActionTypes';
import * as actionFactory from './ProfileActionFactory';

function loadUserEpic(action$) {
  return action$
    .ofType(actionTypes.LOAD_USER_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(PrincipalsApi.getUser(action.id))
        .mergeMap((user) => {
          return Observable.of(
            actionFactory.loadUserSuccess(user)
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactory.loadUserFailure()
          );
        });
    });
}

export default combineEpics(
  loadUserEpic
);
