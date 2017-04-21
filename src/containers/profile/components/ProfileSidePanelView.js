import React, { PropTypes } from 'react';

import ProfileAvatar from './ProfileAvatarView';
import styles from '../styles.module.css';

const ProfileSidePanel = ({ fullName, googleId }) => {
  return (
    <div className={styles.sidePanelWrapper}>
      <ProfileAvatar
          fullName={fullName}
          googleId={googleId} />
    </div>
  );
};

ProfileSidePanel.propTypes = {

};

export default ProfileSidePanel;
