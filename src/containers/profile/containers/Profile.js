import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import ProfileView from '../components/ProfileView';
import { fetchOrganizationsRequest } from '../../organizations/actions/OrganizationsActionFactory';
import { getSortedOrgs } from '../AccountHelpers.js';

class Profile extends React.Component {
  static propTypes = {

  }

  componentDidMount() {
    this.props.fetchOrganizationsRequest();
  }

  render() {
    const { fullName, googleId, email, visibleOrganizationIds, organizations, auth } = this.props;

    return(
      <ProfileView
          fullName={fullName}
          googleId={googleId}
          email={email}
          orgs={getSortedOrgs(visibleOrganizationIds, organizations, auth)} />
    );
  }
}

function mapStateToProps(state) {
  const account = state.get('account');
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const visibleOrganizationIds = state.getIn(
    ['organizations', 'visibleOrganizationIds'],
    Immutable.Set()
  );

  return {
    fullName: account.get('fullName'),
    googleId: account.get('googleId'),
    email: account.get('email'),
    organizations,
    visibleOrganizationIds
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    fetchOrganizationsRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
