import React, { PropTypes } from 'react';

import defaultAvatar from '../../../images/user-profile-icon.png';
import Avatar from 'react-avatar';
import styles from '../styles.module.css';

const ProfileAvatar = ({ fullName, googleId }) => {
  return (
    <div className={styles.avatarWrapper}>
      <Avatar name={fullName} googleId={googleId} size="188" className={styles.avatar} />
    </div>
  );
};

ProfileAvatar.propTypes = {

};

export default ProfileAvatar;
