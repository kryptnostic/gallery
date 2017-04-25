import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import ProfileView from '../components/ProfileView';
import { loadUserRequest } from '../ProfileActionFactory';

class Profile extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.instanceOf(Immutable.Map).isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.loadUser(this.props.id);
  }

  getGoogleId = () => {
    const reg = /\bgoogle-oauth2\|/;
    const id = this.props.id;
    if (reg.exec(id)[0].length > 0) {
      return id.replace(reg, '');
    }

    return null;
  }

  render() {
    return (
      <ProfileView
          nickname={this.props.user.get('nickname')}
          googleId={this.getGoogleId()}
          email={this.props.user.get('email')} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const profile = state.get('profile');

  return {
    id: ownProps.params.id,
    user: profile.get('user')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    loadUser: loadUserRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
