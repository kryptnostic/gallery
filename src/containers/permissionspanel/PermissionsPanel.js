import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Immutable, { List, Map, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import StringConsts from '../../utils/Consts/StringConsts';
import ActionConsts from '../../utils/Consts/ActionConsts';
import DeleteButton from '../../components/buttons/DeleteButton';
import styles from './styles.module.css';

import { Permission } from '../../core/permissions/Permission';
import { ORGANIZATION, USER, ROLE, AUTHENTICATED_USER, ADMIN } from '../../utils/Consts/UserRoleConsts';
import { getAllUsers } from './PermissionsPanelActionFactory';
import { getAclRequest, updateAclRequest } from '../permissions/PermissionsActionFactory';
import { fetchOrganizationsRequest } from '../organizations/actions/OrganizationsActionFactory';


const views = {
  GLOBAL: 'Everyone',
  ORGANIZATIONS: 'Organizations',
  ROLES: 'Roles',
  EMAILS: 'Emails'
};

const orders = {
  FIRST: 'first',
  LAST: 'last'
};

const permissionsByLabel = {
  Discover: Permission.DISCOVER.name,
  Link: Permission.LINK.name,
  Materialize: Permission.MATERIALIZE.name,
  Read: Permission.READ.name,
  Write: Permission.WRITE.name,
  Owner: Permission.OWNER.name
};

const PERMISSIONS_BY_VIEW = {
  [views.ORGANIZATIONS]: [
    Permission.MATERIALIZE
  ],
  [views.ROLES]: [
    Permission.OWNER,
    Permission.WRITE,
    Permission.READ,
    Permission.LINK,
    Permission.DISCOVER
  ],
  [views.EMAILS]: [
    Permission.OWNER,
    Permission.WRITE,
    Permission.READ,
    Permission.LINK,
    Permission.DISCOVER
  ]
}

class PermissionsPanel extends React.Component {
  static propTypes = {
    allSelected: PropTypes.bool,
    entitySetId: PropTypes.string,
    propertyTypeId: PropTypes.string,
    aclKeysToUpdate: PropTypes.array,
    actions: PropTypes.shape({
      getAllUsers: PropTypes.func.isRequred,
      getAclRequest: PropTypes.func.isRequired,
      fetchOrganizationsRequest: PropTypes.func.isRequired,
      updateAclRequest: PropTypes.func.isRequired
    }),
    users: PropTypes.instanceOf(Immutable.Map).isRequired,
    aclKeyPermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired,
    rolesById: PropTypes.instanceOf(Immutable.Map).isRequired,
    orgsById: PropTypes.instanceOf(Immutable.Map).isRequired,
    loadUsersError: PropTypes.string.isRequired,
    loadRolesError: PropTypes.string.isRequired,
    isOrganization: PropTypes.bool
  }

  static defaultProps = {
    allSelected: false,
    isOrganization: false
  }

  constructor(props) {
    super(props);
    this.state = {
      view: views.EMAILS,
      newRoleValue: '',
      newEmailValue: '',
      newOrganizationValue: '',
      selectedPermissionForEmailsView: Permission.OWNER.getFriendlyName(),
      selectedPermissionForRolesView: Permission.OWNER.getFriendlyName(),
      selectedPermissionForOrganizationsView: Permission.MATERIALIZE.getFriendlyName()
    };
  }

  componentDidMount() {

    // this is super heavy, but... move fast, break things
    this.loadAllAcls(this.props.aclKeysToUpdate);
  }

  componentWillReceiveProps(nextProps) {

    // this feels hacky
    const prevAclKeys = fromJS(this.props.aclKeysToUpdate);
    const nextAclKeys = fromJS(nextProps.aclKeysToUpdate);
    if (!prevAclKeys.equals(nextAclKeys)) {
      this.loadAllAcls(nextProps.aclKeysToUpdate);
    }
  }

  getAclKey = () => {
    const { entitySetId, propertyTypeId } = this.props;
    const aclKey = propertyTypeId ? [entitySetId, propertyTypeId] : [entitySetId];
    return fromJS(aclKey);
  }

  loadAllAcls = (aclKeys) => {

    this.props.actions.getAllUsers();

    if (!this.props.isOrganization) {
      this.props.actions.fetchOrganizationsRequest();
    }

    aclKeys.forEach((aclKey) => {
      this.props.actions.getAclRequest(aclKey);
    });
  }

  switchView = (view) => {
    this.setState({ view });
  }

  getSelectedClassName = (view) => {
    return (view === this.state.view)
      ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  getFirstLastClassName = (order) => {
    if (order === 'first') return styles.firstEdmButton;
    if (order === 'last') return styles.lastEdmButton;
    return null;
  }

  renderError = (errorMessage) => {
    if (!errorMessage.length) return null;
    return <div className={styles.errorMsg}>{errorMessage}</div>;
  }

  getPanelViewContents = () => {
    switch (this.state.view) {
      case views.ORGANIZATIONS:
        return this.getOrganizationsView();
      case views.ROLES:
        return this.getRolesView();
      case views.EMAILS:
        return this.getEmailsView();
      case views.GLOBAL:
      default:
        return this.getGlobalView();
    }
  }

  updatePermissions(action, principal, permissions) {
    this.props.aclKeysToUpdate.forEach((aclKey) => {
      const aces = [{ principal, permissions }];
      const acl = { aclKey, aces };
      const req = { action, acl };
      this.props.actions.updateAclRequest(req);
    });
  }

  buttonStyle = (view, viewState, order) => {
    const buttonSelectedStyle = view === viewState
      ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
    const buttonFirstLastStyle = this.buttonFirstLastStyle(order);
    return `${buttonSelectedStyle} ${buttonFirstLastStyle}`;
  }

  buttonFirstLastStyle = (order) => {
    if (order === 'first') return styles.firstEdmButton;
    if (order === 'last') return styles.lastEdmButton;
    return null;
  }

  updateGlobalPermissions = (permission, checked) => {
    const principal = {
      type: ROLE,
      id: AUTHENTICATED_USER
    };
    const action = checked ? ActionConsts.ADD : ActionConsts.REMOVE;
    this.updatePermissions(action, principal, [permission]);
  }

  getGlobalView = () => {
    const { aclKeyPermissions } = this.props;
    const rolePermissions = aclKeyPermissions.getIn([this.getAclKey(), ROLE], Map());
    const selectedGlobalValues = rolePermissions.keySeq().filter((permission) => {
      return rolePermissions.get(permission).includes(AUTHENTICATED_USER);
    });

    const options = [Permission.DISCOVER, Permission.LINK, Permission.READ]
      .map((permission) => {
        const checkboxName = `global-${permission}`;
        return (
          <div key={permission.name}>
            <label htmlFor={checkboxName} className={styles.globalLabel}>{permission.getFriendlyName()}</label>
            <input
                id={checkboxName}
                type="checkbox"
                checked={selectedGlobalValues.includes(permission.name)}
                onChange={(e) => {
                  this.updateGlobalPermissions(permission.name, e.target.checked);
                }} />
          </div>
        );
      });
    return (
      <div>
        {this.renderError(this.props.loadRolesError)}
        <div>Choose the default permissions for all authenticated users:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          {options}
        </div>
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  changeRolesView = (permission) => {
    this.setState({
      newRoleValue: '',
      selectedPermissionForRolesView: permission
    });
  }

  getPermissionsForView = (view, action) => {
    const permission = permissionsByLabel[view];
    return (permission === Permission.OWNER.name && action === ActionConsts.ADD)
      ? [permission, Permission.WRITE.name, Permission.READ.name, Permission.LINK.name, Permission.DISCOVER.name]
      : [permission];
  }

  updateRoles = (action, role, view) => {
    // Only if changes were made, save changes
    if (role) {
      const principal = {
        type: ROLE,
        id: role
      };
      this.updatePermissions(action, principal, this.getPermissionsForView(view, action));
    }
  }

  handleNewRoleChange = (e) => {
    const newRoleValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newRoleValue });
  }

  viewPermissionTypeButton = (permission, fn, currentlySelectedPermission, order) => {
    return (
      <button
          key={permission}
          onClick={() => {
            fn(permission);
          }}
          className={this.buttonStyle(permission, currentlySelectedPermission, order)}>
        <div className={styles.edmNavItemText}>{permission}</div>
      </button>
    );
  }

  renderPermissionButtons = (permissions, fn, currentlySelectedPermission) => {
    return permissions.map((permission, index) => {
      let order;
      if (index === 0) order = orders.FIRST;
      else if (index === permissions.length - 1) order = orders.LAST;
      return this.viewPermissionTypeButton(permission.getFriendlyName(), fn, currentlySelectedPermission, order);
    });
  }

  formatRoleTitle = (roleId, orgId) => {
    const { organizations, rolesById } = this.props;
    const roleTitle = rolesById.getIn([roleId, 'title'], '');
    const orgTitle = organizations.getIn([orgId, 'title'], '');
    return `${roleTitle} (${orgTitle})`;
  }

  getRoleOptions = (roleList) => {
    const roleOptions = [];
    this.props.organizations.forEach((organization) => {
      organization.get('roles').forEach((rolePrincipal) => {
        const roleId = rolePrincipal.getIn(['principal', 'id'], '');
        if (!roleList.includes(roleId) && roleId !== ADMIN && roleId !== AUTHENTICATED_USER) {
          const label = this.formatRoleTitle(roleId, organization.get('id'));
          roleOptions.push({ value: roleId, label });
        }
      });
    });
    return roleOptions;
  }

  getRolesView = () => {
    const { newRoleValue, selectedPermissionForRolesView } = this.state;
    const { aclKeyPermissions, aclKeysToUpdate, allSelected, rolesById } = this.props;

    const filterRolesForAclKeyForSelectedPermission = (aclKey, selectedPermission) => {
      const selectedPermissionLabel = permissionsByLabel[selectedPermission];
      return aclKeyPermissions
        .getIn([aclKey, ROLE, selectedPermissionLabel], List())
        .filter(roleId => (roleId !== ADMIN && roleId !== AUTHENTICATED_USER));
    };

    let roleIdList;
    const selectedAclKey = this.getAclKey();

    if (selectedAclKey.size === 1 && allSelected) {
      const roleIdToCountMap = {};
      aclKeysToUpdate.forEach((aclKey) => {
        const iAclKey = fromJS(aclKey); // because keys in aclKeyPermissions are Immutable objects
        const roleIds = filterRolesForAclKeyForSelectedPermission(iAclKey, selectedPermissionForRolesView);
        roleIds.forEach((roleId) => {
          const count = roleIdToCountMap[roleId];
          roleIdToCountMap[roleId] = (typeof count === 'number' && count > 0) ? (count + 1) : 1;
        });
      });
      roleIdList = fromJS(roleIdToCountMap)
        .filter(count => count === aclKeysToUpdate.length)
        .keySeq()
        .toList();
    }
    else {
      roleIdList = filterRolesForAclKeyForSelectedPermission(selectedAclKey, selectedPermissionForRolesView);
    }

    const roleOptions = this.getRoleOptions(roleIdList);
    const hiddenBody = roleIdList.filter(roleId => rolesById.has(roleId)).map((roleId) => {
      const role = rolesById.get(roleId);
      const roleTitle = this.formatRoleTitle(roleId, role.get('organizationId'));
      return (
        <div className={styles.tableRows} key={roleIdList.indexOf(roleId)}>
          <div className={styles.inline}>
            <DeleteButton
                onClick={() => {
                  this.updateRoles(ActionConsts.REMOVE, roleId, selectedPermissionForRolesView);
                }} />
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{roleTitle}</div>
        </div>
      );
    });
    return (
      <div>
        {this.renderError(this.props.loadRolesError)}
        <div>Choose default permissions for specific roles.</div>
        <div className={`${styles.inline} ${styles.padTop}`}>
          {this.renderPermissionButtons(
            PERMISSIONS_BY_VIEW[views.ROLES],
            this.changeRolesView,
            selectedPermissionForRolesView
          )}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {hiddenBody}
        </div>
        <div className={styles.inline}>
          <Select
              value={newRoleValue}
              options={roleOptions}
              onChange={this.handleNewRoleChange}
              className={`${styles.inputBox} ${styles.permissionInputWidth}`} />
          <Button
              bsStyle="primary"
              className={`${styles.spacerMargin}`}
              disabled={this.state.newRoleValue.length === 0}
              onClick={() => {
                this.updateRoles(ActionConsts.ADD, newRoleValue, selectedPermissionForRolesView);
              }}>Add</Button>
        </div>
      </div>
    );
  }

  changeEmailsView = (permission) => {
    this.setState({
      newEmailValue: '',
      selectedPermissionForEmailsView: permission
    });
  }

  updateEmails = (action, userId, view) => {
    const principal = {
      type: USER,
      id: userId
    };
    this.updatePermissions(action, principal, this.getPermissionsForView(view, action));
  }

  handleNewEmailChange = (e) => {
    const newEmailValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newEmailValue });
  }

  getEmailOptions = (userIdList) => {
    const emailOptions = [];

    this.props.users.valueSeq().forEach((user) => {
      if (user) {
        const id = user.get('user_id');
        const email = user.get('email');
        if (!userIdList.includes(id) && !!email) {
          emailOptions.push({ label: email, value: id });
        }
      }
    });
    return emailOptions;
  }

  getEmailsView = () => {

    const { newEmailValue, selectedPermissionForEmailsView } = this.state;
    const { aclKeyPermissions, aclKeysToUpdate, allSelected } = this.props;

    const filterUsersForAclKeyForSelectedPermission = (aclKey, selectedPermission) => {
      const selectedPermissionLabel = permissionsByLabel[selectedPermission];
      return aclKeyPermissions
        .getIn([aclKey, USER, selectedPermissionLabel], List())
        .filter((userId) => {
          // filter out user ids with OWNER permissions, since OWNER implies having all other permissions
          const owners = aclKeyPermissions.getIn([aclKey, USER, Permission.OWNER.name], List());
          if (selectedPermission !== Permission.OWNER.getFriendlyName() && owners.includes(userId)) {
            return false;
          }
          const user = this.props.users.get(userId);
          return (!!user && !!user.get('email'));
        });
    };

    let userIdList;
    const selectedAclKey = this.getAclKey();

    if (selectedAclKey.size === 1 && allSelected) {
      const userIdToCountMap = {};
      aclKeysToUpdate.forEach((aclKey) => {
        const iAclKey = fromJS(aclKey); // because keys in aclKeyPermissions are Immutable objects
        const userIds = filterUsersForAclKeyForSelectedPermission(iAclKey, selectedPermissionForEmailsView);
        userIds.forEach((userId) => {
          const count = userIdToCountMap[userId];
          userIdToCountMap[userId] = (typeof count === 'number' && count > 0) ? (count + 1) : 1;
        });
      });
      userIdList = fromJS(userIdToCountMap)
        .filter(count => count === aclKeysToUpdate.length)
        .keySeq()
        .toList();
    }
    else {
      userIdList = filterUsersForAclKeyForSelectedPermission(selectedAclKey, selectedPermissionForEmailsView);
    }

    const emailOptions = this.getEmailOptions(userIdList);
    const emailListBody = userIdList.map((userId) => {
      return (
        <div className={styles.tableRows} key={userId}>
          <div className={styles.inline}>
            <DeleteButton
                onClick={() => {
                  this.updateEmails(ActionConsts.REMOVE, userId, selectedPermissionForEmailsView);
                }} />
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{this.props.users.getIn([userId, 'email'], '')}</div>
        </div>
      );
    });

    return (
      <div>
        {this.renderError(this.props.loadUsersError)}
        <div>Choose permissions for specific users.</div>
        <div className={`${styles.padTop} ${styles.inline}`}>
          {this.renderPermissionButtons(
            PERMISSIONS_BY_VIEW[views.EMAILS],
            this.changeEmailsView,
            selectedPermissionForEmailsView
          )}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {emailListBody}
        </div>
        <div className={styles.inline}>
          <Select
              value={newEmailValue}
              options={emailOptions}
              onChange={this.handleNewEmailChange}
              className={`${styles.inputBox} ${styles.permissionInputWidth}`} />
          <Button
              bsStyle="primary"
              className={`${styles.spacerMargin}`}
              disabled={this.state.newEmailValue.length === 0}
              onClick={() => {
                this.updateEmails(ActionConsts.ADD, newEmailValue, selectedPermissionForEmailsView);
              }}>Add</Button>
        </div>
      </div>
    );
  }


  updateOrganizations = (action, orgId, view) => {
    const principal = {
      type: ORGANIZATION,
      id: orgId
    };
    this.updatePermissions(action, principal, this.getPermissionsForView(view, action));
  }

  handleNewOrganizationChange = (e) => {
    const newOrganizationValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newOrganizationValue });
  }

  getOrganizationOptions = (orgList) => {
    const { organizations } = this.props;

    const orgOptions = [];
    organizations.forEach((organization) => {
      const orgId = organization.getIn(['principal', 'id'], '');
      const label = organization.get('title', '');

      if (!orgList.includes(orgId)) {
        orgOptions.push({ value: orgId, label });
      }
    });
    return orgOptions;
  }

  getOrganizationsView = () => {

    const { newOrganizationValue, selectedPermissionForOrganizationsView } = this.state;
    const { aclKeyPermissions, aclKeysToUpdate, allSelected, orgsById } = this.props;

    const filterOrganizationsForAclKeyForSelectedPermission = (aclKey, selectedPermission) => {
      const selectedPermissionLabel = permissionsByLabel[selectedPermission];
      return aclKeyPermissions.getIn([aclKey, ORGANIZATION, selectedPermissionLabel], List());
    };

    let orgIdList;
    const selectedAclKey = this.getAclKey();

    if (selectedAclKey.size === 1 && allSelected) {
      const userIdToCountMap = {};
      aclKeysToUpdate.forEach((aclKey) => {
        const iAclKey = fromJS(aclKey); // because keys in aclKeyPermissions are Immutable objects
        const userIds = filterOrganizationsForAclKeyForSelectedPermission(iAclKey, selectedPermissionForOrganizationsView);
        userIds.forEach((userId) => {
          const count = userIdToCountMap[userId];
          userIdToCountMap[userId] = (typeof count === 'number' && count > 0) ? (count + 1) : 1;
        });
      });
      orgIdList = fromJS(userIdToCountMap)
        .filter(count => count === aclKeysToUpdate.length)
        .keySeq()
        .toList();
    }
    else {
      orgIdList = filterOrganizationsForAclKeyForSelectedPermission(selectedAclKey, selectedPermissionForOrganizationsView);
    }

    const orgOptions = this.getOrganizationOptions(orgIdList);
    const orgListBody = orgIdList.map((orgId) => {
      return (
        <div className={styles.tableRows} key={orgId}>
          <div className={styles.inline}>
            <DeleteButton
                onClick={() => {
                  this.updateOrganizations(ActionConsts.REMOVE, orgId, selectedPermissionForOrganizationsView);
                }} />
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{orgsById.getIn([orgId, 'title'], '<Unknown Organization>')}</div>
        </div>
      );
    });

    return (
      <div>
        {this.renderError(this.props.loadUsersError)}
        <div>Choose which organizations can materialize this entity set.</div>
        <div className={`${styles.padTop} ${styles.inline}`}>
          {this.renderPermissionButtons(
            PERMISSIONS_BY_VIEW[views.ORGANIZATIONS],
            () => {},
            selectedPermissionForOrganizationsView
          )}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {orgListBody}
        </div>
        <div className={styles.inline}>
          <Select
              value={newOrganizationValue}
              options={orgOptions}
              onChange={this.handleNewOrganizationChange}
              className={`${styles.inputBox} ${styles.permissionInputWidth}`} />
          <Button
              bsStyle="primary"
              className={`${styles.spacerMargin}`}
              disabled={this.state.newOrganizationValue.length === 0}
              onClick={() => {
                this.updateOrganizations(ActionConsts.ADD, newOrganizationValue, selectedPermissionForOrganizationsView);
              }}>Add</Button>
        </div>
      </div>
    );
  }

  renderViewButton = (view, order) => {
    const selectedClassName = this.getSelectedClassName(view);
    const firstLastClassName = this.getFirstLastClassName(order);

    return (
      <button
          onClick={() => {
            this.switchView(view);
          }}
          className={`${selectedClassName} ${firstLastClassName}`}>
        <div className={styles.edmNavItemText}>{view}</div>
      </button>
    );
  }

  render() {
    const { isOrganization } = this.props;

    return (
      <div>
        <div className={styles.edmNavbarContainer}>
          <div className={styles.edmNavbar}>
            { isOrganization ? null : this.renderViewButton(views.GLOBAL, orders.FIRST) }
            { isOrganization ? null : this.renderViewButton(views.ORGANIZATIONS) }
            { isOrganization ? null : this.renderViewButton(views.ROLES) }
            {this.renderViewButton(views.EMAILS, orders.LAST)}
          </div>
        </div>
        <div className={styles.panelContents}>{this.getPanelViewContents()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const permissions = state.get('permissionsPanel');
  const myId = JSON.parse(localStorage.profile).user_id;

  let rolesById = Map();
  let orgsById = Map();
  state.getIn(['organizations', 'organizations'], Map()).valueSeq().forEach((org) => {
    org.get('roles').forEach((role) => {
      rolesById = rolesById.set(role.getIn(['principal', 'id'], ''), role);
    });

    orgsById = orgsById.set(org.getIn(['principal', 'id']), org);
  });

  return {
    users: permissions.get('users', Map()).delete(myId),
    rolesById,
    orgsById,
    aclKeyPermissions: permissions.get('aclKeyPermissions', Map()),
    loadUsersError: permissions.get('loadUsersError'),
    loadRolesError: permissions.get('loadRolesError'),
    organizations: state.getIn(['organizations', 'organizations'], Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {
  const actions = {
    getAllUsers,
    getAclRequest,
    updateAclRequest,
    fetchOrganizationsRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsPanel);
