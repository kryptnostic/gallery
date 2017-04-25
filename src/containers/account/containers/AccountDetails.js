import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProfileForm from '../../../components/profile/ProfileForm';

class AccountDetails extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    jwtToken: PropTypes.string.isRequired
  }

  getContent = () => {
    const { userId, jwtToken } = this.props;
    const accountId = {
      key: 'accountId',
      value: userId,
      label: 'Account ID'
    };

    const jwt = {
      key: 'jwtToken',
      value: jwtToken,
      label: 'JWT Token'
    };

    return [accountId, jwt];
  }

  render() {
    return (
      <ProfileForm
          header={'Account Details'}
          content={this.getContent()} />
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    userId: profile.user_id,
    jwtToken: window.localStorage.id_token
  };
}

export default connect(mapStateToProps)(AccountDetails);
