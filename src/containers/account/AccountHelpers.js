import { sortOrganizations } from '../organizations/utils/OrgsUtils';

function getRoles(org) {
  const roles = [];
  if (org.get('isOwner')) {
    roles.push('Owner');
  }
  let orgRoles = org.get('roles').map((role) => {
    return role.get('id').slice(org.get('id').length + 1);
  });
  orgRoles = orgRoles.toJS();

  return roles.concat(orgRoles).join(', ');
}

export function getSortedOrgs(visibleOrganizationIds, organizations, auth) {
  if (visibleOrganizationIds.size < 0 || organizations.size < 0 || !auth) {
    return [];
  }

  let sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, auth);
  sortedOrgs = sortedOrgs.yourOrgs.concat(sortedOrgs.memberOfOrgs);

  sortedOrgs = sortedOrgs.map((org) => {
    const id = org.get('id');
    const title = org.get('title');
    const roles = getRoles(org);

    return {
      id,
      title,
      roles
    };
  });

  return sortedOrgs;
}
