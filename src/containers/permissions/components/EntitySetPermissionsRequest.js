import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import { EntitySetPropType } from '../../edm/EdmModel';
import { StatusPropType } from '../PermissionsStorage'
import { createPrincipalReference } from '../../principals/PrincipalsStorage';
import PrincipalActionsFactory from '../../principals/PrincipalsActionFactory';
import { createEntitySetReference, getEdmObjectSilent } from '../../edm/EdmStorage';


import { AsyncReferencePropType } from '../../async/AsyncStorage';
import AsyncContentComponent from '../../async/components/AsyncContentComponent';
import styles from './permissions.module.css';

class EntitySetPermissionsRequest extends React.Component {
  static propTypes = {
    principalId: PropTypes.string.isRequired,
    entitySetId: PropTypes.string.isRequired,
    statuses: PropTypes.arrayOf(StatusPropType).isRequired,

    // Loaders
    loadPrincipal: PropTypes.func.isRequired,

    // Async
    principalReference: AsyncReferencePropType.isRequired,
    // TODO: Move to AsyncReference
    entitySet: EntitySetPropType

  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    this.props.loadPrincipal(this.props.principalId);
  }

  renderProperty(principalId, propertyType, requestedRead) {
    return (
      <div className="propertyType">
        <div className="propertyTypePermissions">
          <input type="checkbox" id={`ptr-${principalId}-${propertyType.id}`} checked={requestedRead}/>
        </div>
        <div className="propertyTypeTitle">
          <label htmlFor={`ptr-${principalId}-${propertyType.id}`}>{propertyType.title}</label>
        </div>
      </div>
    )
  }

  toggleBody = () => {
    this.setState({ open: !this.state.open });
  };

  renderContent = (principal) => {
    const { statuses, entitySet } = this.props;
    const propertyTypes = entitySet.entityType.properties;

    const statusByPropertyTypeId = groupBy(statuses, (status) => status.aclKey[1]);
    const content = propertyTypes.map(propertyType => {
      return this.renderProperty(principal.id, propertyType, statusByPropertyTypeId[propertyType.id]);
    });

    return (
      <div className={styles.permissionsRequest}>
        <div className={styles.permissionRequestHeader} onClick={this.toggleBody}>
          <div className={styles.permissionRequestTitle}>
            <span className={styles.principalName}>{ principal.get('nickname') } </span>
            requested permission on
            <span className={styles.entitySetTitle}> { entitySet.title }</span>
          </div>
          <button className={styles.approveButton}>
            <FontAwesome name="thumbs-o-up"/>
            Allow
          </button>
          <button className={styles.rejectButton}>
            <FontAwesome name="thumbs-o-down"/>
            Deny
          </button>
        </div>

        <div className={styles.permissionRequestBody}>
          <div className={styles.subtitle}>Properties requested:</div>
          <div className={styles.propertyList}>{ content }</div>
        </div>
      </div>
    );
  };

  render() {
    const { principalReference } = this.props;

    return (
      // Hack to force re-rendering on state change
      <div className={classnames({[styles.open]: this.state.open})}>
        <AsyncContentComponent reference={principalReference} render={this.renderContent}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS();

  const { principalId, entitySetId } = ownProps;

  const entitySet = getEdmObjectSilent(normalizedData, createEntitySetReference(entitySetId), null);

  return {
    principalReference: createPrincipalReference(principalId),
    entitySet
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    loadPrincipal: (principalId) => {
      dispatch(PrincipalActionsFactory.loadPrincipalDetails(principalId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequest);