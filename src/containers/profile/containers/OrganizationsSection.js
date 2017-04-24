import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import OrganizationSectionView from '../components/OrganizationSectionView';
import { fetchOrganizationsRequest } from '../../organizations/actions/OrganizationsActionFactory';
import { getSortedOrgs } from '../AccountHelpers.js';

class OrganizationsSection extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    fetchOrganizationsRequest: PropTypes.func.isRequired,
    visibleOrganizationIds: PropTypes.instanceOf(Immutable.Set).isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {
    this.props.fetchOrganizationsRequest();
  }

  render() {
    const { visibleOrganizationIds, organizations, auth } = this.props;
    return (
      <OrganizationSectionView
          header="Your Organizations"
          content={getSortedOrgs(visibleOrganizationIds, organizations, auth)} />
    );
  }
}

function mapStateToProps(state) {
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const visibleOrganizationIds = state.getIn(
    ['organizations', 'visibleOrganizationIds'],
    Immutable.Set()
  );

  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsSection);
