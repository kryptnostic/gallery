import React, { PropTypes } from 'react';

import ProfileAbout from './ProfileAboutView';
import ProfileOrgs from './ProfileOrgsView';
import styles from '../styles.module.css';

const ProfileMainPanel = ({}) => {
  return (
    <div className={styles.mainPanelWrapper}>
      <ProfileAbout />
      <ProfileOrgs />
    </div>
  );
};

ProfileMainPanel.propTypes = {

};

export default ProfileMainPanel;
