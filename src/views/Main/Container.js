import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from './styles.module.css';

import * as edmActionFactories from '../../containers/edm/EdmActionFactories';
import HeaderNav from '../../components/headernav/HeaderNav';
import SideNav from '../../components/sidenav/SideNav';
import PageConsts from '../../utils/Consts/PageConsts';
import RequestPermissionsModal from '../../containers/permissions/components/RequestPermissionsModal';

class Container extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    loadPropertyTypes: PropTypes.func.isRequired,
    loadEntityTypes: PropTypes.func.isRequired
  };

  static childContextTypes = {
    isAdmin: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = props.route.profileFn();

    const profile = JSON.parse(window.localStorage.profile);
    this.state.fullName = profile.name;
    this.state.googleId = profile.identities[0].user_id;
  }

  componentDidMount() {
    if (this.props.route.auth.loggedIn()) {
      this.props.loadPropertyTypes();
      this.props.loadEntityTypes();
    }
  }

  getChildContext() {
    return {
      isAdmin: this.props.route.profileFn().isAdmin
    };
  }

  updateState = () => {
    this.setState(this.props.route.profileFn());
  };

  getChildren() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth,
        updateTopbarFn: this.updateState,
        profileFn: this.props.route.profileFn
      });
    }
    return children;
  }

  render() {

    return (
      <DocumentTitle title={PageConsts.DEFAULT_DOCUMENT_TITLE}>
        <div className={styles.appWrapper}>
          <RequestPermissionsModal />
          <HeaderNav auth={this.props.route.auth}
              isAdmin={this.state.isAdmin}
              name={this.state.name}
              fullName={this.state.fullName}
              googleId={this.state.googleId} />
          <div className={styles.appBody}>
            <SideNav name={this.state.name} />
            <div className={styles.appContent}>
              { this.getChildren() }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPropertyTypes: () => {
      dispatch(edmActionFactories.allPropertyTypesRequest());
    },
    loadEntityTypes: () => {
      dispatch(edmActionFactories.allEntityTypesRequest());
    }
  };
}

export default connect(null, mapDispatchToProps)(Container);
