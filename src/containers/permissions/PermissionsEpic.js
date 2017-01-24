/*
 * @flow
 */

import {
  AuthorizationApi
} from 'loom-data';

import {
  Observable
} from 'rxjs';

import {
  combineEpics
} from 'redux-observable'

import * as PermissionsActionTypes from './PermissionsActionTypes';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import AsyncActionFactory from '../async/AsyncActionFactory';

import {
  STATUS as ASYNC_STATUS
} from '../async/AsyncStorage';

import {
  deserializeAuthorization,
  createStatusAsyncReference
} from './PermissionsStorage';

import type {
  AccessCheck,
  PermissionsRequest,
  AclKey,
  Status
} from './PermissionsStorage'

import Api from '../Api';

function updateStatuses(statuses :Status[]) {
  return Observable.from(Api.updateStatuses(statuses))
    .mergeMap(response => {
      const tuples = statuses.map(status => [createStatusAsyncReference(status.aclKey), status]);
      return tuples.map(tuple => AsyncActionFactory.updateAsyncReference(tuple[0], tuple[1]));
    });
}

function updateStatusesEpic(action$) {
  return action$.ofType(PermissionsActionTypes.UPDATE_STATUSES)
    .pluck('statuses')
    .mergeMap(updateStatuses)
}

function loadStatuses(reqStatus :string, aclKeys :AclKey[]) {
  const references = aclKeys.map(createStatusAsyncReference);
  return Observable.merge(
    Observable.from(references)
      .map(AsyncActionFactory.asyncReferenceLoading),

    Observable.from(Api.getStatus(reqStatus, aclKeys))
      .mergeMap(statuses => {
        const statusByReferenceId = {};
        statuses.forEach(status => {
          statusByReferenceId[createStatusAsyncReference(status.aclKey).id] = status;
        });

        return references.map(reference => {
          const status = statusByReferenceId[reference.id];
          const value = status ? status : ASYNC_STATUS.NOT_FOUND;
          return AsyncActionFactory.updateAsyncReference(reference, value);
        });
      })
  );
}

function loadStatusesEpic(action$) {
  return action$.ofType(PermissionsActionTypes.LOAD_STATUSES)
    .mergeMap(action => loadStatuses(action.reqStatus, action.aclKeys));
}

function requestPermissions(requests :PermissionsRequest[]) :Observable<Action> {
  return Observable
    .of(requests)
    // .from(permissionsRequest(requests))
    .map(console.log);
}

function requestPermissionsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(PermissionsActionTypes.REQUEST_PERMISSIONS_REQUEST)
    .pluck('requests')
    .mergeMap(requestPermissions);
}

// TODO: Save property types
function authorizationCheck(accessChecks :AccessCheck[]) :Observable<Action> {

  return Observable
    .from(AuthorizationApi.checkAuthorizations(accessChecks))
    .map((authorizations) => {
      return authorizations.map(deserializeAuthorization);
    })
    .map(PermissionsActionFactory.checkAuthorizationResolve)
    .catch(() => {
      return Observable.of(
        PermissionsActionFactory.checkAuthorizationReject(accessChecks, 'Error loading authorizations')
      );
    });
}

// TODO: Cancellation and Error handling
function authorizationCheckEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.CHECK_AUTHORIZATION_REQUEST)
    .pluck('accessChecks')
    .mergeMap(authorizationCheck);
}

export default combineEpics(authorizationCheckEpic, requestPermissionsEpic, loadStatusesEpic, updateStatusesEpic);