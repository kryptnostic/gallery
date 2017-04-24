import React from 'react';
import PropTypes from 'prop-types';

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
  fullName: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired
};

export default ProfileSidePanel;
