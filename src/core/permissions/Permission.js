// @flow

import { Enum } from 'enumify';

export class Permission extends Enum {
  static maxPermission(perm1:Permission, perm2:Permission) {
    return perm1.ordinal > perm2.ordinal ? perm1 : perm2;
  }
}

function enumFactory(friendlyName) {
  return {
    getFriendlyName() {
      return friendlyName;
    },
    hasPermission(permission:Permission) {
      return this.ordinal >= permission.ordinal;
    }
  };
}
Permission.initEnum({
  HIDDEN: enumFactory('Hidden'),
  DISCOVER: enumFactory('Discover'),
  LINK: enumFactory('Link'),
  READ: enumFactory('Read'),
  WRITE: enumFactory('Write'),
  OWNER: enumFactory('Owner')
});
Permission.enumValueOf = Permission.enumValueOf.bind(Permission);
