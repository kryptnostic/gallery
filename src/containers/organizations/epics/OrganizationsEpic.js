/*
 * @flow
 */

import {
  DataModels,
  Types,
  OrganizationsApi
} from 'loom-data';

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as OrgsActionFactory from '../actions/OrganizationsActionFactory';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';

const {
  Organization
} = DataModels;

const {
  PermissionTypes,
  PrincipalTypes
} = Types;

function fetchOrgs() :Observable<Action> {

  return Observable
    .from(OrganizationsApi.getAllOrganizations())
    .mergeMap((organizations :Organization[]) => {

      const isOwnerAccessChecks = organizations.map((org :Organization) => {
        return {
          aclKey: [org.id],
          permissions: [PermissionTypes.OWNER]
        };
      });

      return Observable.of(
        OrgsActionFactory.fetchOrgsSuccess(organizations),
        PermissionsActionFactory.checkAuthorizationRequest(isOwnerAccessChecks)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.fetchOrgsFailure()
      );
    });
}

export function fetchOrgsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_REQUEST)
    .mergeMap(fetchOrgs);
}

function addDomainToOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    emailDomain
  } = action;

  return Observable
    .from(OrganizationsApi.addAutoApprovedEmailDomain(orgId, emailDomain))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.addDomainToOrgSuccess(orgId, emailDomain)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.addDomainToOrgFailure()
      );
    });
}

export function addDomainToOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.ADD_DOMAIN_TO_ORG_REQUEST)
    .mergeMap(addDomainToOrg);
}

function removeDomainFromOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    emailDomain
  } = action;

  return Observable
    .from(OrganizationsApi.removeAutoApprovedEmailDomain(orgId, emailDomain))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.removeDomainFromOrgSuccess(orgId, emailDomain)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.removeDomainFromOrgFailure()
      );
    });
}

export function removeDomainFromOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.REMOVE_DOMAIN_FROM_ORG_REQUEST)
    .mergeMap(removeDomainFromOrg);
}

function addRoleToOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    role
  } = action;

  return Observable
    .from(OrganizationsApi.addPrincipal(orgId, PrincipalTypes.ROLE, role))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.addRoleToOrgSuccess(orgId, role)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.addRoleToOrgFailure()
      );
    });
}

export function addRoleToOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.ADD_ROLE_TO_ORG_REQUEST)
    .mergeMap(addRoleToOrg);
}

function removeRoleFromOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    role
  } = action;

  return Observable
    .from(OrganizationsApi.removePrincipal(orgId, PrincipalTypes.ROLE, role))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.removeRoleFromOrgSuccess(orgId, role)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.removeRoleFromOrgFailure()
      );
    });
}

export function removeRoleFromOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST)
    .mergeMap(removeRoleFromOrg);
}

export default combineEpics(
  fetchOrgsEpic,
  addDomainToOrgEpic,
  removeDomainFromOrgEpic,
  addRoleToOrgEpic,
  removeRoleFromOrgEpic
);
