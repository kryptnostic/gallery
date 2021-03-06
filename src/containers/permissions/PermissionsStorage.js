/* @flow */
import { PropTypes } from 'react';
import { Map } from 'immutable';
import objectValues from 'lodash/values';
import type { AsyncReference } from '../async/AsyncStorage';

export const PERMISSIONS = Object.freeze({
  DISCOVER: 'DISCOVER',
  LINK: 'LINK',
  MATERIALIZE: 'MATERIALIZE',
  READ: 'READ',
  WRITE: 'WRITE',
  OWNER: 'OWNER'
});
export const ALL_PERMISSIONS = Object.freeze(objectValues(PERMISSIONS));

// TODO: Switch Permissions to Immutable.Map when Components are switched to immutable
export const DEFAULT_PERMISSIONS = ((permissions) => {

  const defaultPermissions = {};
  permissions.forEach((permission) => {
    defaultPermissions[permission] = false;
  });
  return Object.freeze(defaultPermissions);
})(ALL_PERMISSIONS);

export type Permissions = {
  DISCOVER :boolean,
  LINK :boolean,
  MATERIALIZE :boolean,
  READ :boolean,
  WRITE :boolean,
  OWNER :boolean
};
export const PermissionsPropType = ((permissions) => {

  const defaultPermissions = {};
  permissions.forEach((permission) => {
    defaultPermissions[permission] = PropTypes.bool.isRequired;
  });
  return PropTypes.shape(defaultPermissions);
})(ALL_PERMISSIONS);

export type AclKey = string[];
export const AclKeyPropType = PropTypes.arrayOf(PropTypes.string);

export type AccessCheck = {
  aclKey :AclKey,
  permissions :string[]
}

export type Authorization = {
  aclKey :AclKey,
  permissions :Permissions
};

export const AuthorizationPropType = PropTypes.shape({
  aclKey: AclKeyPropType.isRequired,
  permissions: PermissionsPropType
});

export type AuthNRequest = {
  aclKey :AclKey,
  permissions :string[],
  reason :string
};

export type Principal = {
  type :string,
  id :string
};
export const PrincipalPropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
});

// export const RequestStatus = Object.freeze({
//   SUBMITTED: 'SUBMITTED',
//   APPROVED: 'APPROVED',
//   DECLINED: 'DECLINED'
// });
// export type Status = {
//   aclKey :AclKey,
//   principal :Principal,
//   permissions :string[],
//   status :string
// }
// export const StatusPropType = PropTypes.shape({
//   aclKey: AclKeyPropType.isRequired,
//   principal: PrincipalPropType.isRequired,
//   permissions: PropTypes.arrayOf(PropTypes.oneOf(ALL_PERMISSIONS)).isRequired,
//   status: PropTypes.string.isRequired
// });

/* Async Stuff */
export function createStatusAsyncReference(aclKey :AclKey) :AsyncReference {
  return {
    id: aclKey.join('/'),
    namespace: 'permissions.status'
  };
}

export function createAuthnAsyncReference(aclKey :AclKey) :AsyncReference {
  return {
    id: aclKey.join('/'),
    namespace: 'permissions.authn'
  };
}

/* Utility Functions */
export function deserializeAuthorization(rawAuthorization :Object) :Authorization {
  return {
    aclKey: rawAuthorization.aclKey,
    permissions: Object.assign({}, DEFAULT_PERMISSIONS, rawAuthorization.permissions)
  };
}

export function createAccessCheck(aclKey :AclKey) {
  return {
    aclKey,
    permissions: ALL_PERMISSIONS
  };
}

/**
 * return permissions. If none are found, return default
 * @param permissionsState
 * @param aclKey
 */
export function getPermissions(permissionsState :Map<string,*>, aclKey :AclKey) :Permissions {
  const permissions = permissionsState.get('authorizations').getIn(aclKey.concat(['permissions']));
  if (permissions) {
    // TODO: Remove toJS() when components move to Immutable
    return permissions.toJS();
  }
  return DEFAULT_PERMISSIONS;
}
