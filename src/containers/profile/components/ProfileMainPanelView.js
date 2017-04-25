import React from 'react';
import PropTypes from 'prop-types';

import ProfileAbout from './ProfileAboutView';
import styles from '../styles.module.css';

const ProfileMainPanel = ({ email }) => {
  return (
    <div className={styles.mainPanelWrapper}>
      <ProfileAbout email={email} />
    </div>
  );
};

ProfileMainPanel.propTypes = {
  email: PropTypes.string.isRequired
};

export default ProfileMainPanel;
