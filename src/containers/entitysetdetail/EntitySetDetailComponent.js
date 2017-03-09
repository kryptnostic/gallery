import React, { PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import {
  EntityDataModelApi
} from 'loom-data';

import * as actionFactories from './EntitySetDetailActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import EntitySetPermissionsRequestList from '../permissions/components/EntitySetPermissionsRequestList';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../permissions/PermissionsStorage';
import { getEdmObject } from '../edm/EdmStorage';
import PropertyTypeList from '../edm/components/PropertyTypeList';
import { PermissionsPanel } from '../../views/Main/Schemas/Components/PermissionsPanel';
import AddDataForm from '../entitysetforms/AddDataForm';
import ActionDropdown from '../edm/components/ActionDropdown';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { EntitySetPropType } from '../edm/EdmModel';
import Page from '../../components/page/Page';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './entitysetdetail.module.css';

import StyledFlexContainer from '../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../components/flex/StyledFlexContainerStacked';

const TitleControlsContainer = styled(StyledFlexContainer)`
  justify-content: space-between;
`;

const ControlsContainer = styled(StyledFlexContainerStacked)`
  align-items: flex-end;
`;

// TODO: GET PROPERTY PERMISSIONS ALONGSIDE ENTITY PERMISSIONS
// Move permissions logic & state to here -> pass info down to children (AllPermissions, ManagePermissions modals)
// AllPermissions props: userPermissions, rolePermissions
// Logic for Entity & Property permissions:

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    router: PropTypes.object.isRequired,

    // Async content
    entitySet: EntitySetPropType,
    entitySetPermissions: PermissionsPropType.isRequired,

    // Loading
    loadEntitySet: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editingPermissions: false,
      confirmingDelete: false,
      addingData: false,
      deleteError: false,
      propertyTypeIds: [],
      entitySetId: '',
      roleAcls: { Discover: [], Link: [], Read: [], Write: [] },
      userAcls: { Discover: [], Link: [], Read: [], Write: [], Owner: [] },
      allUsersById: {},
      allRolesList: new Set(),
    };
  }

  componentDidMount() {
    this.props.loadEntitySet();
    this.loadAcls(false);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet === undefined && nextProps.entitySet !== undefined ) {
      const propertyTypeIds = nextProps.entitySet.entityType.properties.map((property) => {
        return property.id;
      });

      // TODO: Move to redux
      this.setState({propertyTypeIds, entitySetId: nextProps.entitySet.id});
      localStorage.setItem('entitySet', JSON.stringify(nextProps.entitySet));
      localStorage.setItem('propertyTypeIds', JSON.stringify(propertyTypeIds));
    }
  }

//////// PERMISSIONS LOGIC ///////////
loadAcls = (updateSuccess) => {
  const { entitySetId } = this.state;
  const { propertyTypeId } = this.props;
  const aclKey = [entitySetId];
  if (propertyTypeId) aclKey.push(propertyTypeId);
  this.loadAllUsersAndRoles();
  // HERE IT CAN PERFORM LOGIC FOR BOTH ENTITY AND PROPERTY -> ADD METHODS TO 1. CREATE LIST OF ALL PROPERTIES AND 2. ADD PROPERTY ACES -> PASS INTO ALLPERMISSIONS
  PermissionsApi.getAcl(aclKey)
  .then((acls) => {
    this.updateStateAcls(acls.aces, updateSuccess);
  })
  .catch(() => {
    this.setState({ updateError: true });
  });
}

loadAllUsersAndRoles = () => {
  let allUsersById = {};
  const allRolesList = new Set();
  const myId = JSON.parse(localStorage.profile).user_id;
  PrincipalsApi.getAllUsers()
  .then((users) => {
    allUsersById = users;
    Object.keys(users).forEach((userId) => {
      users[userId].roles.forEach((role) => {
        if (role !== AUTHENTICATED_USER) allRolesList.add(role);
      });
    });
    allUsersById[myId] = null;

    return new Promise((resolve, reject) => {
      this.setState(
        {
          allUsersById,
          allRolesList,
          loadUsersError: false
        },
        // () => {
        //   resolve(this.state.allUsersById);
        // }
      );
    });
  })
  // ///////////TODO: REMOVE ONCE THIS LOGIC IS ON ESDC: CAN CALL ONCE ALLPERMISSIONS IS MOUNTED AND PROPS PASSED IN
  // .then(() => {
  //   this.getUserPermissions();
  //   this.getRolePermissions();
  // })
  .catch(() => {
    this.setState({ loadUsersError: true });
  });
}

updateStateAcls = (aces, updateSuccess) => {
  let globalValue = [];
  const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
  const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
  aces.forEach((ace) => {
    if (ace.permissions.length > 0) {
      if (ace.principal.type === ROLE) {
        if (ace.principal.id === AUTHENTICATED_USER) {
          globalValue = this.getPermission(ace.permissions);
        }
        else {
          this.getPermission(ace.permissions).forEach((permission) => {
            roleAcls[permission].push(ace.principal.id);
          });
        }
      }
      else {
        this.getPermission(ace.permissions).forEach((permission) => {
          userAcls[permission].push(ace.principal.id);
        });
      }
    }
  });

  this.setState({
    globalValue,
    roleAcls,
    userAcls,
    updateSuccess,
    newRoleValue: '',
    newEmailValue: '',
    updateError: false
  });
}

getPermission = (permissions) => {
  const newPermissions = [];
  if (permissions.includes(permissionOptions.Owner.toUpperCase())) return [permissionOptions.Owner];
  if (permissions.includes(permissionOptions.Write.toUpperCase())) newPermissions.push(permissionOptions.Write);
  if (permissions.includes(permissionOptions.Read.toUpperCase())) newPermissions.push(permissionOptions.Read);
  if (permissions.includes(permissionOptions.Link.toUpperCase())) newPermissions.push(permissionOptions.Link);
  if (permissions.includes(permissionOptions.Discover.toUpperCase())) newPermissions.push(permissionOptions.Discover);
  return newPermissions;
}



//////// VIEW LOGIC ///////////
  setEditingPermissions = () => {
    this.setState({ editingPermissions: true });
  };

  renderHeaderContent = () => {
    const { entitySet, entitySetPermissions } = this.props;

    const contactValue = (entitySet.contacts.length > 0) ? entitySet.contacts.join(', ') : 'none';

    return (
      <StyledFlexContainerStacked>
        <TitleControlsContainer>
          <div>
            <Page.Title>{entitySet.title}</Page.Title>
            <div className={styles.descriptionTitle}>About this data</div>
            {entitySet.description}
            <div className={styles.contacts}>Owner contact: {contactValue}</div>
          </div>

          <ControlsContainer>

            <ActionDropdown entitySetId={entitySet.id} className={classnames(styles.actionDropdown)} />
            {
              entitySetPermissions.OWNER &&
              <Button bsStyle="info" onClick={this.setEditingPermissions} className={styles.managePermissions}>
                Manage Permissions
              </Button>
            }
          </ControlsContainer>
        </TitleControlsContainer>
        {
          entitySetPermissions.OWNER &&
          <EntitySetPermissionsRequestList
              entitySetId={entitySet.id}
              propertyTypeIds={entitySet.entityType.properties.map((p) => {
                return p.id;
              })} />
        }
      </StyledFlexContainerStacked>
    );
  };

  renderPermissionsPanel = () => {
    if (!this.props.entitySet) return null;
    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={this.closePermissionsPanel}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for entity set: {this.props.entitySet.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermissionsPanel entitySetId={this.props.entitySet.id} />
        </Modal.Body>
      </Modal>
    );
  };

  renderSearchEntitySet = () => {
    if (!this.props.entitySet) return null;
    return (
      <div className={styles.buttonWrapper}>
        <Button bsStyle="primary" className={styles.center}>
          <Link className={styles.buttonLink} to={`/search/${this.props.entitySet.id}`}>
            <FontAwesome name="search" />
            <span className={styles.buttonText}>Search this entity set</span>
          </Link>
        </Button>
      </div>
    );
  }

  renderAddDataForm = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.WRITE) return null;
    return (
      <Modal
          show={this.state.addingData}
          onHide={this.closeAddDataModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new row of data to this entity set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddDataForm
              entitySetId={this.props.entitySet.id}
              primaryKey={this.props.entitySet.entityType.key}
              propertyTypes={this.props.entitySet.entityType.properties} />
        </Modal.Body>
      </Modal>
    );
  }

  deleteEntitySet = () => {
    if (!this.props.entitySet) return;
    EntityDataModelApi.deleteEntitySet(this.props.entitySet.id)
    .then(() => {
      this.props.router.push(`/${PageConsts.HOME}`);
    }).catch(() => {
      this.setState({
        confirmingDelete: false,
        deleteError: true
      });
    });
  }

  setConfirmingDelete = () => {
    this.setState({ confirmingDelete: true });
  }

  cancelDelete = () => {
    this.setState({ confirmingDelete: false });
  }

  openAddDataModal = () => {
    this.setState({ addingData: true });
  }

  closeAddDataModal = () => {
    this.setState({ addingData: false });
  }

  onAllPermissions = () => {
    hashHistory.push(`/allpermissions`);
    // hashHistory.push(`/entitysets/${this.props.entitySetId}/allpermissions`);
  }

  renderAddDataButton = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.WRITE) return null;
    return (
      <div className={styles.buttonWrapper}>
        <Button
            bsStyle="success"
            className={styles.center}
            onClick={this.openAddDataModal}>
          <FontAwesome name="plus" size="lg" />
          <span className={styles.buttonText}>Add Data</span>
        </Button>
      </div>
    );
  }

  renderAllPermissions = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.OWNER) return null;
    return (
      <div className={styles.buttonWrapper} >
        <Button
          className={styles.center}
          onClick={this.onAllPermissions}
        >
          <span className={styles.buttonText}>View all permissions</span>
        </Button>
      </div>
    )
  }

  renderDeleteEntitySet = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.OWNER) return null;
    const error = (this.state.deleteError) ? <div className={styles.error}>Unable to delete entity set</div> : null;
    return (
      <div className={styles.buttonWrapper}>
        <Button
            bsStyle="danger"
            className={styles.center}
            onClick={this.setConfirmingDelete}>
          <FontAwesome name="times" size="lg" />
          <span className={styles.buttonText}>Delete this entity set</span>
        </Button>
        {error}
      </div>
    );
  }

  renderConfirmDeleteModal = () => {
    if (!this.props.entitySet) return null;
    return (
      <Modal
          show={this.state.confirmingDelete}
          onHide={this.cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete {this.props.entitySet.title}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.centerWrapper}>
            <Button onClick={this.deleteEntitySet} bsStyle="danger">Confirm</Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  closePermissionsPanel = () => {
    this.setState({ editingPermissions: false });
  };

  render() {
    return (
      <Page>
        <Page.Header>
          <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent} />
        </Page.Header>
        <Page.Body>
          {this.renderAddDataButton()}
          <h2 className={styles.propertyTypeTitle}>Data in Entity Set</h2>
          <AsyncContent
              {...this.props.asyncState}
              content={() => {
                // TODO: Remove when removing denormalization
                const propertyTypeIds = this.props.entitySet.entityType.properties.map((property) => {
                  return property.id;
                });
                return (
                  <PropertyTypeList
                      entitySetId={this.props.entitySet.id}
                      propertyTypeIds={propertyTypeIds}
                      className="propertyTypeStyleDefault" />
                );
              }} />
          {this.renderAddDataForm()}
          {this.renderPermissionsPanel()}
          {this.renderSearchEntitySet()}
          {this.renderAllPermissions()}
          {this.renderDeleteEntitySet()}
          {this.renderConfirmDeleteModal()}
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const normalizedData = state.get('normalizedData');
  const permissions = state.get('permissions');

  let entitySet;
  let entitySetPermissions;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
    entitySetPermissions = getPermissions(permissions, [entitySet.id]);
  }
  else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  return {
    asyncState: entitySetDetail.get('asyncState').toJS(),
    entitySet,
    entitySetPermissions
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const id = ownProps.params.id;
  return {
    loadEntitySet: () => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
