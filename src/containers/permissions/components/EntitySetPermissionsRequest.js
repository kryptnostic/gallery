import React from 'react';

import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import groupBy from 'lodash/groupBy';

import { Models, Types } from 'lattice';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PermissionsActionFactory from '../PermissionsActionFactory';
import * as PrincipalsActionFactory from '../../principals/PrincipalsActionFactory';

import { createAsyncComponent } from '../../async/components/AsyncContentComponent';
import { createPrincipalReference } from '../../principals/PrincipalsStorage';
import { getDisplayName, getEmail } from '../../principals/PrincipalUtils';

import styles from './permissions.module.css';

const { RequestStatus } = Models;
const { RequestStateTypes } = Types;

class EntitySetPermissionsRequest extends React.Component {
  static propTypes = {
    principal: PropTypes.any,
    principalId: PropTypes.string.isRequired,
    entitySetId: PropTypes.string.isRequired,
    // statuses: PropTypes.arrayOf(RequestStatus).isRequired,

    // Saving
    updateStatuses: PropTypes.func.isRequired,
    // Loaders
    loadPrincipal: PropTypes.func.isRequired,

    // TODO: Move to AsyncReference
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    customSettings: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  constructor(props) {
    super(props);
    const selectedProperties = new Set();
    props.statuses.forEach((status) => {
      selectedProperties.add(status.request.aclKey[1]);
    });
    this.state = {
      open: false,
      // TODO: Move to Redux
      selectedProperties
    };
  }

  sendUpdateRequests = (requestStatus) => {
    const { updateStatuses, statuses } = this.props;
    const { selectedProperties } = this.state;
    if (statuses.length > 0) {
      const updatedStatuses = [];
      const defaultStatus = statuses[0];
      selectedProperties.forEach((propertyTypeId) => {
        const updatedStatus = Immutable
          .fromJS(defaultStatus)
          .set('status', requestStatus)
          .setIn(['request', 'aclKey', 1], propertyTypeId)
          .toJS();
        updatedStatuses.push(updatedStatus);
      });
      updateStatuses(updatedStatuses);
    }
  };

  approve = () => {
    this.sendUpdateRequests(RequestStateTypes.APPROVED);
  };

  deny = () => {
    this.sendUpdateRequests(RequestStateTypes.DECLINED);
  };

  toggleCheckbox = (checked, propertyTypeId) => {
    const selectedProperties = new Set(this.state.selectedProperties);
    if (checked) {
      selectedProperties.add(propertyTypeId);
    }
    else {
      selectedProperties.delete(propertyTypeId);
    }
    this.setState({ selectedProperties });
  };

  renderProperty(principalId, propertyType, defaultChecked) {
    const propertyTypeId = propertyType.get('id');
    const title = this.props.customSettings.getIn([propertyTypeId, 'title'], propertyType.get('title'));
    return (
      <div className="propertyType" key={propertyTypeId}>
        <div className="propertyTypePermissions">
          <input
              type="checkbox"
              id={`ptr-${principalId}-${propertyTypeId}`}
              defaultChecked={defaultChecked}
              onClick={(e) => {
                this.toggleCheckbox(e.target.checked, propertyTypeId);
              }} />
        </div>
        <div className="propertyTypeTitle">
          <label htmlFor={`ptr-${principalId}-${propertyTypeId}`}>{title}</label>
        </div>
      </div>
    );
  }

  toggleBody = () => {
    this.setState({ open: !this.state.open });
  };

  render() {

    const { statuses, principal, propertyTypes } = this.props;

    const reasonList = new Set();
    statuses.forEach((status) => {
      reasonList.add(status.request.reason);
    });

    const reasons = [];
    reasonList.forEach((reason) => {
      reasons.push(<div key={reason} className={styles.requestMessage}>{reason}</div>);
    });

    const statusByPropertyTypeId = groupBy(statuses, (status) => {
      return status.request.aclKey[1];
    });

    const content = [];
    propertyTypes.forEach((propertyType) => {
      content.push(
        this.renderProperty(principal.id, propertyType, statusByPropertyTypeId[propertyType.get('id')])
      );
    });

    const principalDisplayName = `${getDisplayName(principal)} (${getEmail(principal)})`;

    return (
      <div className={classnames({ [styles.open]: this.state.open })}>
        <div className={styles.permissionsRequest}>
          <div className={styles.permissionRequestHeader}>
            <div className={styles.permissionRequestTitle}>
              <span className={styles.principalName}>{principalDisplayName} </span>
              requested permission on
              <a onClick={this.toggleBody}> {statuses.length} {statuses.length === 1 ? 'property' : 'properties'}</a>
            </div>
            <button className={styles.approveButton} onClick={this.approve}>
              <FontAwesome name="thumbs-o-up" />
              Allow
            </button>
            <button className={styles.rejectButton} onClick={this.deny}>
              <FontAwesome name="thumbs-o-down" />
              Deny
            </button>
          </div>

          <div className={styles.permissionRequestBody}>
            <div className={styles.subtitle}>Message:</div>
            {reasons}
            <div className={styles.subtitle}>Properties requested:</div>
            <div className="propertyTypeList">{ content }</div>
          </div>
        </div>
      </div>
    );
  }
}

EntitySetPermissionsRequest.Async = createAsyncComponent(EntitySetPermissionsRequest);

class EntitySetPermissionsRequestWrapper extends React.Component {

  static propTypes = {
    principalId: PropTypes.string.isRequired,
    loadPrincipal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadPrincipal(this.props.principalId);
  }

  render() {

    const principalReference = createPrincipalReference(this.props.principalId);

    return (
      <EntitySetPermissionsRequest.Async
          principal={principalReference}
          {...this.props} />
    );
  }
}

EntitySetPermissionsRequestWrapper.Async = createAsyncComponent(EntitySetPermissionsRequestWrapper);

function mapStateToProps(state, ownProps) {

  const { entitySetId, principalId } = ownProps;

  const entitySet = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());
  const entityTypeId = entitySet.get('entityTypeId');
  const entityType = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());
  const propertyTypeIds = entityType.get('properties', Immutable.List());

  let propertyTypes = Immutable.List();
  if (!propertyTypeIds.isEmpty()) {
    propertyTypeIds.forEach((propertyTypeId) => {
      propertyTypes = propertyTypes.push(
        state.getIn(['edm', 'propertyTypes', propertyTypeId], Immutable.Map())
      );
    });
  }

  return {
    entitySet,
    principalId,
    propertyTypes
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPrincipal: PrincipalsActionFactory.loadPrincipalDetails,
    updateStatuses: PermissionsActionFactory.updateStatusesRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequestWrapper.Async);
