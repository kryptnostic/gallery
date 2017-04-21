import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProfileView from '../components/ProfileView';

class Profile extends React.Component {
  static propTypes = {

  }

  render() {
    return(
      <ProfileView
          fullName={this.props.fullName}
          googleId={this.props.googleId}
          email={this.props.email} />
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

  return {
    fullName,
    googleId,
    email
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {

  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
