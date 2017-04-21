import React, { PropTypes } from 'react';

import ProfileAvatar from './ProfileAvatarView';
import styles from '../styles.module.css';

const ProfileSidePanel = ({}) => {
  return (
    <div className={styles.sidePanelWrapper}>
      <ProfileAvatar />
    </div>
  );
};

ProfileSidePanel.propTypes = {

};

export default ProfileSidePanel;
