import React, { PropTypes } from 'react';

import ProfileAvatar from './ProfileAvatarView';
import ProfileAbout from './ProfileAboutView';
import ProfileOrgs from './ProfileOrgsView';
import styles from '../styles.module.css';

const ProfileMainPanel = ({ email }) => {
  return (
    <div className={styles.mainPanelWrapper}>
      <ProfileAbout email={email} />
      <ProfileOrgs />
    </div>
  );
};

ProfileMainPanel.propTypes = {

};

export default ProfileMainPanel;
