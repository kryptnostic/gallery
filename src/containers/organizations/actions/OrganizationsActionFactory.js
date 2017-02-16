/*
 * @flow
 */

import {
  DataModels
} from 'loom-data';

import * as OrgsActionTypes from './OrganizationsActionTypes';

const Organization = DataModels.Organization;

export function fetchOrganizationRequest(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_REQUEST,
    orgId
  };
}

export function fetchOrganizationSuccess(organization :Organization) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_SUCCESS,
    organization
  };
}

export function fetchOrganizationFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_FAILURE
  };
}

export function fetchOrganizationsRequest() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_REQUEST
  };
}

export function fetchOrganizationsSuccess(organizations :Organization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_SUCCESS,
    organizations
  };
}

export function fetchOrganizationsFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_FAILURE
  };
}

export function fetchOrganizationsAuthorizationsRequest(organizations :Organization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_REQUEST,
    organizations
  };
}

export function fetchOrganizationsAuthorizationsSuccess(authorizations :Authorization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_SUCCESS,
    authorizations
  };
}

export function fetchOrganizationsAuthorizationsFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_FAILURE
  };
}


export function searchOrgsRequest(searchQuery :string) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_REQUEST,
    searchQuery
  };
}

export function searchOrgsSuccess(searchResults :any) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_SUCCESS,
    searchResults
  };
}

export function searchOrgsFailure() :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_FAILURE
  };
}

export function joinOrgRequest(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_REQUEST,
    orgId
  };
}

export function joinOrgSuccess() :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_SUCCESS
  };
}

export function joinOrgFailure() :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_FAILURE
  };
}
