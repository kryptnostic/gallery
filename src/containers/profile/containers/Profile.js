import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import AuthService from '../../../utils/AuthService';

import ProfileView from '../components/ProfileView';
import { fetchOrganizationsRequest } from '../../organizations/actions/OrganizationsActionFactory';
import { getSortedOrgs } from '../AccountHelpers';

class Profile extends React.Component {
  static propTypes = {
    fullName: PropTypes.string.isRequired,
    googleId: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    visibleOrganizationIds: PropTypes.object.isRequired,
    organizations: PropTypes.object.isRequired,
    auth: React.PropTypes.instanceOf(AuthService).isRequired,
    fetchOrganizationsRequest: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.fetchOrganizationsRequest();
  }

  render() {
    const {
      fullName,
      googleId,
      email,
      visibleOrganizationIds,
      organizations,
      auth
    } = this.props;

    return (
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
