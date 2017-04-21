import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import ProfileView from '../components/ProfileView';
import { fetchOrganizationsRequest } from '../../organizations/actions/OrganizationsActionFactory';
import { sortOrganizations } from '../../organizations/utils/OrgsUtils';

class Profile extends React.Component {
  static propTypes = {

  }

  componentDidMount() {
    fetchOrganizationsRequest();
  }

  getRoles = (org) => {
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

  getSortedOrgs = () => {
    const { visibleOrganizationIds, organizations, auth } = this.props;

    let sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, auth);
    sortedOrgs = sortedOrgs.yourOrgs.concat(sortedOrgs.memberOfOrgs);

    sortedOrgs = sortedOrgs.map((org) => {
      const id = org.get('id');
      const title = org.get('title');
      const roles = this.getRoles(org);

      return {
        id,
        title,
        roles
      };
    });

    return sortedOrgs;
  }

  render() {
    return(
      <ProfileView
          fullName={this.props.fullName}
          googleId={this.props.googleId}
          email={this.props.email}
          orgs={this.getSortedOrgs()} />
    );
  }
}

function mapStateToProps(state) {
  let fullName = '';
  let googleId = '';
  let email = '';

  if (window.localStorage.profile) {
    const profile = JSON.parse(window.localStorage.profile);
    fullName = profile.name;
    googleId = profile.identities[0].user_id;
    email = profile.email;
  }

  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const visibleOrganizationIds = state.getIn(
    ['organizations', 'visibleOrganizationIds'],
    Immutable.Set()
  );

  return {
    fullName,
    googleId,
    email,
    organizations,
    visibleOrganizationIds
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {

  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
