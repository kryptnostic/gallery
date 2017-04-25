import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';

import styles from '../styles.module.css';

const ProfileAvatarView = ({ nickname, googleId }) => {
  return (
    <div className={styles.avatarWrapper}>
      <Avatar name={nickname} googleId={googleId} size={180} className={styles.avatar} />
    </div>
  );
};

ProfileAvatarView.propTypes = {
  nickname: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired
};

export default ProfileAvatarView;
