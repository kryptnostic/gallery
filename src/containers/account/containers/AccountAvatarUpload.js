import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from 'react-avatar';

import PhotoUpload from '../../../components/photos/PhotoUpload';

// TODO: Implememnt
class AccountAvatarUpload extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string
  }

  static defaultProps = {
    id: ''
  }

  getAvatar = () => {
    const { name, id } = this.props;
    return <Avatar name={name} googleId={id} />;
  }

  render() {
    return (
      <PhotoUpload
          header={'Avatar'}
          content={this.getAvatar()} />
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.profile);

  return {
    name: profile.name,
    id: profile.identities[0].user_id
  };
}

export default connect(mapStateToProps)(AccountAvatarUpload);
