import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';

import styles from '../styles.module.css';

const ProfileAvatar = ({ fullName, googleId }) => {
  return (
    <div className={styles.avatarWrapper}>
      <Avatar name={fullName} googleId={googleId} size={180} className={styles.avatar} />
    </div>
  );
};

ProfileAvatar.propTypes = {
  fullName: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired
};

export default ProfileAvatar;
