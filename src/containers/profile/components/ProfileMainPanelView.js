import React from 'react';
import PropTypes from 'prop-types';

import ProfileAbout from './ProfileAboutView';
import ProfileOrgs from './ProfileOrgsView';
import styles from '../styles.module.css';

const ProfileMainPanel = ({ email, orgs }) => {
  return (
    <div className={styles.mainPanelWrapper}>
      <ProfileAbout email={email} />
      <ProfileOrgs orgs={orgs} />
    </div>
  );
};

ProfileMainPanel.propTypes = {
  email: PropTypes.string.isRequired,
  orgs: PropTypes.array.isRequired
};

export default ProfileMainPanel;
