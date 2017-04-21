import React, { PropTypes } from 'react';

import defaultAvatar from '../../../images/user-profile-icon.png';
import styles from '../styles.module.css';

const ProfileAvatar = () => {
  return (
    <div className={styles.avatarWrapper}>
      <img src={defaultAvatar} className={styles.avatar} />
    </div>
  );
};

ProfileAvatar.propTypes = {

};

export default ProfileAvatar;
